// [
//   {
//     comment: 'Salsa aparte',
//     id: 3,
//     order_date: 1614898540753,
//     order_id: 2,
//     payment_method: null,
//     product_id: 10,
//     product_name: 'Papas refugio',
//     product_price: 450,
//     product_qty: '4',
//     subtotal: 450,
//     table_id: 1,
//     type_name: 'Cocina',
//   },
// ];

export const makeRecipt = (items, data) => {
  const itemsMap = (itms) => {
    let string = '\n';
    itms.map(
      (item) =>
        (string += `<M>${
          item.product_qty + ' ' + item.product_name.toUpperCase()
        }</M>\n`),
    );
    return string;
  };
  const recipt = `<C>${data.date}</C>\n<B>MESA: ${data.table_name}</B>\n
  ${itemsMap(items)}`;

  return recipt;
};
