CREATE UNIQUE INDEX "OrganizationUser_userId_key" ON "OrganizationUser"("userId");

CREATE INDEX "Evidence_organizationId_idx" ON "Evidence"("organizationId");
