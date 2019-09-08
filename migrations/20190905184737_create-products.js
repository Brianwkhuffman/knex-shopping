
exports.up = function (knex) {
    return knex.schema.createTable('products', (table) => {
        table.increments();
        table.string('title').notNullable();
        table.string('description')
        table.integer('inventory').notNullable();
        table.decimal('price', 8, 2);
        table.timestamps(true, true)
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('products');
};
