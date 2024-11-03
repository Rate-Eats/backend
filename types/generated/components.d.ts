import type { Schema, Struct } from '@strapi/strapi';

export interface ImagesImages extends Struct.ComponentSchema {
  collectionName: 'components_images_images';
  info: {
    description: '';
    displayName: 'images';
    icon: 'picture';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
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
