import type { Schema, Attribute } from '@strapi/strapi';

export interface ImagesImages extends Schema.Component {
  collectionName: 'components_images_images';
  info: {
    displayName: 'images';
    icon: 'picture';
    description: '';
  };
  attributes: {
    name: Attribute.Text;
    hash: Attribute.Text;
    extension: Attribute.String;
    path: Attribute.Text;
    main: Attribute.Boolean;
    menu: Attribute.Boolean;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'images.images': ImagesImages;
    }
  }
}
