import { Block } from 'payload'

import { Archive as ArchiveBlock } from './ArchiveBlock/config'
import { Banner } from './Banner/config'
import { CallToAction } from './CallToAction/config'
import { CategoryGridBlock } from './CategoryGridBlock/config'
import { Content } from './Content/config'
import { FormBlock as Form } from './Form/config'
import { GoogleMapBlock } from './GoogleMapBlock/config'
import { ImageSliderBlock } from './ImageSliderBlock/config'
import { MediaBlock } from './MediaBlock/config'
import { ProductsBlock } from './ProductsBlock/config'
import { RelatedPostsBlock } from './RelatedPosts/config'
import { SaleProductsSliderBlock } from './SaleProductsSliderBlock/config'
import { ServiceFeaturesBlock } from './ServiceFeaturesBlock/config'
import { Code } from './Code/config'

export const blocks: Block[] = [
  ArchiveBlock,
  Banner,
  CallToAction,
  CategoryGridBlock,
  Code,
  Content,
  Form,
  GoogleMapBlock,
  ImageSliderBlock,
  MediaBlock,
  ProductsBlock,
  RelatedPostsBlock,
  SaleProductsSliderBlock,
  ServiceFeaturesBlock,
] 