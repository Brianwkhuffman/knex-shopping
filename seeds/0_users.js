
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { email: 'email1', password: 'password1' },
        { email: 'email2', password: 'password2' },
        { email: 'email3', password: 'password3' }
      ]);
    });
};
