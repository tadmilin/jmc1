import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Website Template` : 'Payload Website Template'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      message: {
        fields: [
          {
            name: 'message',
            type: 'richText',
            localized: true
          }
        ],
        labels: {
          plural: 'Message Blocks',
          singular: 'Message'
        }
      },
      payment: false,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
            }
          }
          
          // ตรวจสอบและแก้ไข emails field
          if ('name' in field && field.name === 'emails' && 'fields' in field && Array.isArray(field.fields)) {
            return {
              ...field,
              fields: field.fields.map((emailField: any) => {
                // ตรวจสอบว่า emailField เป็น field ที่มี message หรือไม่
                if ('name' in emailField && emailField.name === 'message') {
                  return {
                    ...emailField,
                  }
                }
                
                // ตรวจสอบว่า emailField เป็น row ที่อาจมี message อยู่ข้างใน
                if (emailField.type === 'row' && Array.isArray(emailField.fields)) {
                  return {
                    ...emailField,
                    fields: emailField.fields.map((rowField: any) => {
                      if ('name' in rowField && rowField.name === 'message') {
                        return {
                          ...rowField,
                        }
                      }
                      return rowField
                    })
                  }
                }
                
                return emailField
              })
            }
          }
          
          return field
        })
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  payloadCloudPlugin(),
]
