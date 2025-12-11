// import { z } from 'zod';

// export const shipmentSchema = z.object({
//   agent: z.string().nonempty('Выберите контрагента'),

//   shipDate: z.date({ message: 'Укажите дату отгрузки' }),
//   code: z.number({ message: 'Укажите код' }),
//   creator: z.string({ message: 'Укажите создателся' }).min(3, 'Минимально 3 символа'),

//   applicationNumber: z.number().min(1, 'Введите номер заявки'),

//   closeDate: z.date({ message: 'Укажите дату закрытия' }),
//   invoiceDate: z.date({ message: 'Укажите дату товарной накладной' }),

//   yearDate: z.date({ message: 'Укажите год заявки' }),

//   description: z.string().optional(),

// });

// export type ShipmentFormValues = z.infer<typeof shipmentSchema>;

// shipment-schema.ts
import { z } from 'zod';

export const shipmentSchema = z.object({
  agent: z.string().min(1, 'Выберите контрагента'),
  shipDate: z.date({ message: 'Укажите дату отгрузки' }),
  code: z.number({ message: 'Укажите код' }).optional(),
  creator: z.string({ message: 'Укажите создателя' }).min(3, 'Минимально 3 символа'),
  applicationNumber: z.number().min(1, 'Введите номер заявки'),
  closeDate: z.date({ message: 'Укажите дату закрытия' }),
  invoiceDate: z.date({ message: 'Укажите дату товарной накладной' }),
  yearDate: z.date({ message: 'Укажите год заявки' }).optional(),
  description: z.string().optional(),
});

export type ShipmentFormValues = z.infer<typeof shipmentSchema>;
