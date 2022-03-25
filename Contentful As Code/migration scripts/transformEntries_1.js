module.exports = function (migration) {
  const article = migration
    .editContentType("article");  
   
  article
    .createField("authorFirstName")
    .name("Author first name")
    .type("Symbol")
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  article
    .createField("authorLastName")
    .name("Author last name")
    .type("Symbol")
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  migration.transformEntries({
    contentType: 'article',
    from: ['authorName'],
    to: ['authorFirstName','authorLastName'],
    transformEntryForLocale: function (fromFields, currentLocale) {

      const currentName = `${fromFields.authorName[currentLocale]}`;
      
      // check if localized field has a value
      if (currentName === 'undefined') {
        return;
      }
      
      // fields name shoudl be same as fields Ids
      const [authorFirstName, authorLastName] = currentName.split(' ');
      return {
        authorFirstName,
        authorLastName
      };

    }
  });

  article
  .editField("authorName")
  .disabled(true)
  .omitted(true);
};
