import type { Struct, Schema } from '@strapi/strapi';

export interface ImagesImages extends Struct.ComponentSchema {
  collectionName: 'components_images_images';
  info: {
    displayName: 'images';
    icon: 'picture';
    description: '';
  };
  attributes: {
    main: Schema.Attribute.Boolean;
    menu: Schema.Attribute.Boolean;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'images.images': ImagesImages;
    }
  }
}
