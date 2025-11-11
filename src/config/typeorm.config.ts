import { DataSourceOptions } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { Organizer } from '../database/entities/organizer.entity';
import { Event } from '../database/entities/event.entity';
import { TicketType } from '../database/entities/ticket-type.entity';
import { TicketInstance } from '../database/entities/ticket-instance.entity';
import { Order } from '../database/entities/order.entity';
import { OrderLine } from '../database/entities/order-line.entity';
import { PaymentMethod } from '../database/entities/payment-method.entity';
import { Payment } from '../database/entities/payment.entity';
import { Report } from '../database/entities/report.entity';

export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  jwt: {
    secret: process.env.JWT_SECRET ?? 'supersecret',
    expiresIn: process.env.JWT_EXPIRES ?? '1d',
  },
  storage: {
    basePath: process.env.STORAGE_BASE_PATH ?? './storage',
  },
  database: {
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASS ?? 'changeme',
    database: process.env.DB_NAME ?? 'powertickets',
    synchronize: true,
    logging: false,
    entities: [
      User,
      Organizer,
      Event,
      TicketType,
      TicketInstance,
      Order,
      OrderLine,
      PaymentMethod,
      Payment,
      Report,
    ],
  } as DataSourceOptions,
});
