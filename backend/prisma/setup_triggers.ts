import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Setting up PostgreSQL Triggers for Audit Logs...");

  // 1. Create the reusable PL/pgSQL function
  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION log_audit_event() RETURNS TRIGGER AS $$
    DECLARE
      v_user_id UUID;
      v_user_role TEXT;
      v_ip_address TEXT;
      v_device_info TEXT;
      v_change_reason TEXT;
    BEGIN
      -- Extract session context if provided by Prisma extension
      BEGIN
        v_user_id := NULLIF(current_setting('app.current_user_id', true), '')::UUID;
      EXCEPTION WHEN OTHERS THEN v_user_id := NULL; END;

      BEGIN
        v_user_role := NULLIF(current_setting('app.current_user_role', true), '');
      EXCEPTION WHEN OTHERS THEN v_user_role := NULL; END;

      BEGIN
        v_ip_address := NULLIF(current_setting('app.ip_address', true), '');
      EXCEPTION WHEN OTHERS THEN v_ip_address := NULL; END;

      BEGIN
        v_device_info := NULLIF(current_setting('app.device_info', true), '');
      EXCEPTION WHEN OTHERS THEN v_device_info := NULL; END;

      BEGIN
        v_change_reason := NULLIF(current_setting('app.change_reason', true), '');
      EXCEPTION WHEN OTHERS THEN v_change_reason := NULL; END;

      IF (TG_OP = 'DELETE') THEN
        INSERT INTO "AuditLog" (
          "logId", "userId", "userRole", "actionType", "tableName", "recordId", 
          "oldValue", "ipAddress", "deviceInfo", "changeReason", "createdAt"
        )
        VALUES (
          gen_random_uuid(), v_user_id, v_user_role, 'DELETE', TG_TABLE_NAME, OLD.id::text, 
          row_to_json(OLD), v_ip_address, v_device_info, v_change_reason, now()
        );
        RETURN OLD;
      ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO "AuditLog" (
          "logId", "userId", "userRole", "actionType", "tableName", "recordId", 
          "oldValue", "newValue", "ipAddress", "deviceInfo", "changeReason", "createdAt"
        )
        VALUES (
          gen_random_uuid(), v_user_id, v_user_role, 'UPDATE', TG_TABLE_NAME, NEW.id::text, 
          row_to_json(OLD), row_to_json(NEW), v_ip_address, v_device_info, v_change_reason, now()
        );
        RETURN NEW;
      ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO "AuditLog" (
          "logId", "userId", "userRole", "actionType", "tableName", "recordId", 
          "newValue", "ipAddress", "deviceInfo", "changeReason", "createdAt"
        )
        VALUES (
          gen_random_uuid(), v_user_id, v_user_role, 'INSERT', TG_TABLE_NAME, NEW.id::text, 
          row_to_json(NEW), v_ip_address, v_device_info, v_change_reason, now()
        );
        RETURN NEW;
      END IF;
      RETURN NULL;
    END;
    $$ LANGUAGE plpgsql;
  `);
  console.log("Created function: log_audit_event()");

  // 2. Attach triggers to tables
  const tables = ['Student', 'Course', 'FeeStructure', 'Batch', 'Application', 'Ticket', 'User'];

  for (const table of tables) {
    // Drop existing trigger to avoid conflicts
    await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS trigger_audit_${table} ON "${table}";`);
    
    // Create new trigger
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER trigger_audit_${table}
      AFTER INSERT OR UPDATE OR DELETE ON "${table}"
      FOR EACH ROW EXECUTE FUNCTION log_audit_event();
    `);
    console.log(`Attached trigger to table: ${table}`);
  }

  console.log("Audit Log Setup Complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
