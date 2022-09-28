import { Knex } from "knex";
import { TransactionType } from "../../../../domain/entities/transaction.entity";

export function up(db: Knex<any, unknown[]>) {
  return db.schema
    .createTable("user", (table) => {
      table.uuid("id").primary();
      table.string("email").unique().notNullable();
      table.string("password").notNullable();
      table.timestamp("createdAt").defaultTo(db.fn.now());
      table.timestamp("updatedtAt").defaultTo(db.fn.now());
      table.timestamp("deletedtAt").defaultTo(db.fn.now());
    })
    .createTable("wallet", (table) => {
      table.uuid("id").primary();
      table.string("accountNo").unique().notNullable();
      table.float("balance").notNullable();
      table.uuid("userId").references("id").inTable("user");
      table.timestamp("createdAt").defaultTo(db.fn.now());
      table.timestamp("updatedtAt").defaultTo(db.fn.now());
      table.timestamp("deletedtAt").defaultTo(db.fn.now());
    })
    .createTable("transaction", (table) => {
      table.uuid("id").primary();
      table.float("amount").notNullable();
      table.uuid("sender").references("id").inTable("wallet");
      table.uuid("reciever").references("id").inTable("wallet");
      table.string("paymentGateway").notNullable();
      table.string("currency").notNullable();
      table.string("referenceCode").notNullable().unique();
      table.timestamp("createdAt").defaultTo(db.fn.now());
      table.timestamp("updatedtAt").defaultTo(db.fn.now());
      table.timestamp("deletedtAt").defaultTo(db.fn.now());
      table
        .enum("transactionType", [
          TransactionType.DEPOSIT,
          TransactionType.TRANSFER,
          TransactionType.WITHDRAWAL,
        ])
        .notNullable();
    });
}

export function down(db: Knex<any, unknown[]>) {
 return db.schema
    .dropTableIfExists("users")
    .dropTableIfExists("wallet")
    .dropSchemaIfExists("transaction");
}
