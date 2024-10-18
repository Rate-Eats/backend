import type { Struct, Schema } from '@strapi/strapi';

export interface ImagesImages extends Struct.ComponentSchema {
  collectionName: 'components_images_images';
  info: {
    displayName: 'images';
    icon: 'picture';
    description: '';
  };
  attributes: {
    name: Schema.Attribute.Text;
    hash: Schema.Attribute.Text;
    extension: Schema.Attribute.String;
    path: Schema.Attribute.Text;
    main: Schema.Attribute.Boolean;
    menu: Schema.Attribute.Boolean;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'images.images': ImagesImages;
    }
  }
}
