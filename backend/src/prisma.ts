import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function withAuditContext<T>(
  context: {
    userId?: string;
    userRole?: string;
    ipAddress?: string;
    deviceInfo?: string;
    changeReason?: string;
  },
  callback: (tx: any) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(async (tx) => {
    // Set local session variables for the transaction
    if (context.userId) await tx.$executeRawUnsafe(`SELECT set_config('app.current_user_id', '${context.userId}', true)`);
    if (context.userRole) await tx.$executeRawUnsafe(`SELECT set_config('app.current_user_role', '${context.userRole}', true)`);
    if (context.ipAddress) await tx.$executeRawUnsafe(`SELECT set_config('app.ip_address', '${context.ipAddress}', true)`);
    if (context.deviceInfo) await tx.$executeRawUnsafe(`SELECT set_config('app.device_info', '${context.deviceInfo}', true)`);
    if (context.changeReason) await tx.$executeRawUnsafe(`SELECT set_config('app.change_reason', '${context.changeReason}', true)`);

    return await callback(tx);
  });
}
