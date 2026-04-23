const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const generateJoinCode = () => crypto.randomBytes(4).toString('hex').toUpperCase();

const sanitizeAuthUser = (user) => ({
  id: user.id,
  email: user.email,
});

const buildMembershipPayload = (membership) => ({
  id: membership.id,
  role: membership.role,
  organizationId: membership.organizationId,
});

const buildOrganizationPayload = (organization) => ({
  id: organization.id,
  name: organization.name,
  joinCode: organization.joinCode,
  createdAt: organization.createdAt,
});

const signAccessToken = ({ userId, organizationId, organizationRole }) =>
  jwt.sign(
    { userId, organizationId, organizationRole },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

const registerUser = async (email, password, organizationName) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('El correo ya está registrado');
  }

  const existingOrganization = await prisma.organization.findUnique({
    where: { name: organizationName },
  });
  if (existingOrganization) {
    throw new Error('El nombre de la organización ya está registrado');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const priorMembership = await tx.organizationUser.findUnique({
      where: { userId: user.id },
    });
    if (priorMembership) {
      throw new Error('El usuario ya pertenece a una organización');
    }

    let organization;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        organization = await tx.organization.create({
          data: {
            name: organizationName,
            joinCode: generateJoinCode(),
          },
        });
        break;
      } catch (error) {
        if (
          error.code === 'P2002' &&
          Array.isArray(error.meta?.target) &&
          error.meta.target.includes('joinCode')
        ) {
          continue;
        }
        throw error;
      }
    }

    if (!organization) {
      throw new Error('No se pudo generar un código de organización único');
    }

    const membership = await tx.organizationUser.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        role: 'OWNER',
      },
    });

    return { user, organization, membership };
  });

  const token = signAccessToken({
    userId: result.user.id,
    organizationId: result.organization.id,
    organizationRole: result.membership.role,
  });

  return {
    user: sanitizeAuthUser(result.user),
    organization: buildOrganizationPayload(result.organization),
    membership: buildMembershipPayload(result.membership),
    token,
  };
};

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      organizationMembership: {
        include: {
          organization: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Credenciales inválidas');
  }

  const membership = user.organizationMembership;
  if (!membership || !membership.organization) {
    throw new Error('El usuario no tiene una organización asociada');
  }

  const token = signAccessToken({
    userId: user.id,
    organizationId: membership.organization.id,
    organizationRole: membership.role,
  });

  return {
    user: sanitizeAuthUser(user),
    organization: buildOrganizationPayload(membership.organization),
    membership: buildMembershipPayload(membership),
    token,
  };
};

module.exports = { registerUser, loginUser };
