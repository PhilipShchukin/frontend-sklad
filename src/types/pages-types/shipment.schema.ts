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

export const shipSchema = z.object({
  group: z.string().min(1),
  shipping_doc: z.string().min(1),
  nomer_tn: z.string().min(1),
  country: z.string().min(1),
  agent: z.number(),
  count: z.string().min(1),
  price: z.string().optional(),
  currency: z.string().optional(),
  comment: z.string().optional(),
  operation_date: z.date(),

  eas_products: z.array(
    z.object({
      gtin: z.string().length(14),
      product_cost: z.string().optional(),
      product_tax: z.string().optional(),
      product_currency: z.string().optional(),
      certificate_document_data: z
        .array(
          z.object({
            certificate_type: z.string(),
            certificate_number: z.string(),
            certificate_date: z.date(),
          }),
        )
        .optional(),
    }),
  ),

  labels: z.array(z.string()).optional(),
  aggregates: z.array(z.string()).optional(),
});

export type ShipFormValues = z.infer<typeof shipSchema>;
