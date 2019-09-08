
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('products').del()
    .then(function () {
      // Inserts seed entries
      return knex('products').insert([
        { title: 'product1', description: 'some descrip one', inventory: 5, price: 9.99 },
        { title: 'product2', description: 'this is the second descrip', inventory: 8, price: 13.37 },
        { title: 'product3', description: 'fourth description product', inventory: 12, price: 5 }
      ]);
    });
};
