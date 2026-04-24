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

const buildMembershipPayload = (membership) =>
  membership
    ? {
      id: membership.id,
      role: membership.role,
      organizationId: membership.organizationId,
    }
    : null;

const buildOrganizationPayload = (organization) =>
  organization
    ? {
      id: organization.id,
      name: organization.name,
      joinCode: organization.joinCode,
      createdAt: organization.createdAt,
    }
    : null;

const signAccessToken = ({ userId, organizationId = null, organizationRole = null }) =>
  jwt.sign(
    { userId, organizationId, organizationRole },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

const loadUserWithOrganization = async (userId, client = prisma) =>
  client.user.findUnique({
    where: { id: userId },
    include: {
      organizationMembership: {
        include: {
          organization: true,
        },
      },
    },
  });

const buildSessionPayload = (user) => {
  const membership = user.organizationMembership || null;
  const organization = membership?.organization || null;
  const token = signAccessToken({
    userId: user.id,
    organizationId: organization?.id ?? null,
    organizationRole: membership?.role ?? null,
  });

  return {
    user: sanitizeAuthUser(user),
    organization: buildOrganizationPayload(organization),
    membership: buildMembershipPayload(membership),
    token,
  };
};

const registerUser = async (email, password, organizationName) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('El correo ya está registrado');
  }

  const normalizedOrganizationName = organizationName?.trim() || null;

  if (normalizedOrganizationName) {
    const existingOrganization = await prisma.organization.findUnique({
      where: { name: normalizedOrganizationName },
    });
    if (existingOrganization) {
      throw new Error('El nombre de la organización ya está registrado');
    }
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const sessionUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    if (!normalizedOrganizationName) {
      return loadUserWithOrganization(user.id, tx);
    }

    let organization;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        organization = await tx.organization.create({
          data: {
            name: normalizedOrganizationName,
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

    await tx.organizationUser.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        role: 'OWNER',
      },
    });

    return loadUserWithOrganization(user.id, tx);
  });

  return buildSessionPayload(sessionUser);
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

  return buildSessionPayload(user);
};

const joinOrganization = async (userId, joinCode) => {
  const normalizedJoinCode = joinCode?.trim().toUpperCase();
  if (!normalizedJoinCode) {
    throw new Error('El código de organización es requerido');
  }

  const sessionUser = await prisma.$transaction(async (tx) => {
    const user = await loadUserWithOrganization(userId, tx);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (user.organizationMembership) {
      throw new Error('El usuario ya pertenece a una organización');
    }

    const organization = await tx.organization.findUnique({
      where: { joinCode: normalizedJoinCode },
    });

    if (!organization) {
      throw new Error('Código de organización inválido');
    }

    await tx.organizationUser.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        role: 'MEMBER',
      },
    });

    return loadUserWithOrganization(user.id, tx);
  });

  return buildSessionPayload(sessionUser);
};

const getCurrentSession = async (userId) => {
  const user = await loadUserWithOrganization(userId);
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  return buildSessionPayload(user);
};

module.exports = {
  registerUser,
  loginUser,
  joinOrganization,
  getCurrentSession,
};
