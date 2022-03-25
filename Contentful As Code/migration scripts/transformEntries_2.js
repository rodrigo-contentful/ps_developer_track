module.exports = function (migration) {
  //  Create new ContentType "author"
  const author = migration
    .createContentType("author")
    .name("Author")
    .description("Author of an article")
    .displayField("firstName");
  
  author
    .createField("firstName")
    .name("First name")
    .type("Symbol")
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  author
    .createField("lastName")
    .name("Last name")
    .type("Symbol")
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  // EDIT ContentType "article" to add new 1-n refernce field
  const article = migration
    .editContentType('article');
  
  article
    .createField('authorRef')
    .type('Link')
    .linkType('Entry')
    .name('The Author');

  // split single field into two in new contentType.
  migration.deriveLinkedEntries({
    contentType: 'article',
    derivedContentType: 'author',
    from: ['authorName'],
    toReferenceField: 'authorRef',
    derivedFields: ['firstName', 'lastName'],
    identityKey: async (fromFields) => {
      return fromFields.authorName['en-US'].toLowerCase().replace(' ', '-');
    },
    shouldPublish: false,
    deriveEntryForLocale: async (inputFields, locale) => {
      // validate that there is a locale, this is undefined if an empty field exist.      
      if (locale !== 'en-US') {
        return;
      }
      const currentName = inputFields.authorName[locale];

      // check if localized field has a value
      if (currentName === 'undefined') {
        return;
      }

      const [firstName, lastName] = currentName.split(' ');

      return {
        firstName,
        lastName
      };
    }
  });

  // Edit original "authorRef" field to restrict by reference field to newly created "author" contenType.
  article
    .editField('authorRef')
    .validations([
      {
        linkContentType: ["author"],
      },
    ]);

  // Disable previous "authorName" field. 
  article
    .editField('authorName')
    .disabled(true);

};