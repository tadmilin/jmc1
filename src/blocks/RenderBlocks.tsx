'use client'

// Remove dynamic import of ImageSliderBlock here
// import dynamic from 'next/dynamic'
import React, { Fragment, Suspense } from 'react'



// Import Block Components directly
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { GoogleMapBlock } from './GoogleMapBlock/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { ImageSliderBlock } from './ImageSliderBlock/Component'
import { CategoryGridBlock } from './CategoryGridBlock/Component'
import { ContentGridBlock } from './ContentGridBlock/Component'
import { ProductsBlock } from './ProductsBlock/Component'
import { RelatedPosts } from './RelatedPosts/Component'
import { SaleProductsSliderBlock } from './SaleProductsSliderBlock/Component'
import { ServiceFeaturesBlock } from './ServiceFeaturesBlock/Component'
import { QuoteRequestFormBlockComponent } from './QuoteRequestFormBlock/Component'
import { CatalogsBlock } from './CatalogsBlock/Component'
// import { CategoryListBlock } from './CategoryListBlock/Component' // Remove categoryList import

// Dynamically import ImageSliderBlock (still needed if ImageSliderBlock has client-specific code)
// const ImageSliderBlock = dynamic(() => import('./ImageSliderBlock/Component').then(mod => mod.ImageSliderBlock), { ssr: false });

// Define blockComponents map here
const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  googleMap: GoogleMapBlock,
  mediaBlock: MediaBlock,
  imageSlider: ImageSliderBlock,
  categoryGrid: CategoryGridBlock,
  contentGrid: ContentGridBlock,
  productsBlock: ProductsBlock,
  relatedPosts: RelatedPosts,
  saleProductsSliderBlock: SaleProductsSliderBlock,
  serviceFeatures: ServiceFeaturesBlock,
  quoteRequestFormBlock: QuoteRequestFormBlockComponent,
  catalogsBlock: CatalogsBlock, // Add CatalogsBlock with correct slug
}

type BlockType = keyof typeof blockComponents

// Updated props type to include colorTheme
export const RenderBlocks: React.FC<{
  blocks: Array<{ blockType: BlockType } & Record<string, unknown>>
  colorTheme?: string
}> = (props) => {
  const { blocks, colorTheme = 'light' } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        <Suspense fallback={<div>Loading...</div>}>
          {blocks.map((block, index) => {
            const { blockType } = block

            if (blockType && blockType in blockComponents) {
              const Block = blockComponents[blockType]

              if (Block) {
                // กรณีที่ต้องส่งในรูปแบบพิเศษ (ส่งผ่าน block prop)
                if (
                  blockType === 'categoryGrid' ||
                  blockType === 'contentGrid' ||
                  blockType === 'imageSlider' ||
                  blockType === 'googleMap' ||
                  blockType === 'serviceFeatures'
                ) {
                  return (
                    <div key={index}>
                      {/* @ts-expect-error there may be some mismatch between the expected types here */}
                      <Block block={block} colorTheme={colorTheme} />
                    </div>
                  )
                }

                // กรณี QuoteRequestFormBlock ส่งข้อมูลแบบพิเศษ
                if (blockType === 'quoteRequestFormBlock') {
                  return (
                    <div key={index}>
                      {/* @ts-expect-error there may be some mismatch between the expected types here */}
                      <Block {...block} />
                    </div>
                  )
                }

                // กรณี ProductsBlock ส่ง colorTheme เพิ่มเติม
                if (blockType === 'productsBlock') {
                  return (
                    <div key={index}>
                      {/* @ts-expect-error there may be some mismatch between the expected types here */}
                      <Block {...block} colorTheme={colorTheme} />
                    </div>
                  )
                }

                // กรณี CatalogsBlock
                if (blockType === 'catalogsBlock') {
                  return (
                    <div key={index}>
                      {/* @ts-expect-error async component */}
                      <Block {...block} />
                    </div>
                  )
                }

                // กรณี SaleProductsSliderBlock ส่ง colorTheme เพิ่มเติม
                if ((blockType as string) === 'saleProductsSliderBlock') {
                  return (
                    <div key={index}>
                      {/* @ts-expect-error there may be some mismatch between the expected types here */}
                      <Block {...block} colorTheme={colorTheme} />
                    </div>
                  )
                }

                // กรณี ArchiveBlock ส่ง colorTheme เพิ่มเติม
                if (blockType === 'archive') {
                  return (
                    <div key={index}>
                      {/* @ts-expect-error there may be some mismatch between the expected types here */}
                      <Block {...block} colorTheme={colorTheme} disableInnerContainer />
                    </div>
                  )
                }

                // กรณีอื่นๆ ใช้การส่งแบบเดิม
                return (
                  <div key={index}>
                    {/* @ts-expect-error there may be some mismatch between the expected types here */}
                    <Block {...block} disableInnerContainer />
                  </div>
                )
              }
            }
            return null
          })}
        </Suspense>
      </Fragment>
    )
  }

  return null
}
