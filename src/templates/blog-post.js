import React, { useEffect } from 'react'
import { graphql } from 'gatsby'

import * as Elements from '../components/elements'
import { Layout } from '../layout'
import { Head } from '../components/head'
import { PostTitle } from '../components/post-title'
import { PostContainer } from '../components/post-container'
import { SocialShare } from '../components/social-share'
import { SponsorButton } from '../components/sponsor-button'
import { Bio } from '../components/bio'
import { PostNavigator } from '../components/post-navigator'
import { Disqus } from '../components/disqus'
import { Utterences } from '../components/utterances'
import * as ScrollManager from '../utils/scroll'
import { PostDate } from '../components/post-date'
import AdSense from 'react-adsense';

import '../styles/code.scss'

export default ({ data, pageContext, location }) => {
  useEffect(() => {
    ScrollManager.init()
    return () => ScrollManager.destroy()
  }, [])

  const post = data.markdownRemark
  const metaData = data.site.siteMetadata
  const { title, comment, siteUrl, author, sponsor } = metaData
  const { disqusShortName, utterances } = comment

  return (
    <Layout location={location} title={title}>
      <Head title={post.frontmatter.title} description={post.excerpt} />
      <PostTitle title={post.frontmatter.title} />
      <PostDate date={post.frontmatter.date} />
      <PostContainer html={post.html} />
      {/* <SocialShare title={post.frontmatter.title} author={author} /> */}
      {!!sponsor.buyMeACoffeeId && (
        <SponsorButton sponsorId={sponsor.buyMeACoffeeId} />
      )}
      <br />
      <AdSense.Google
        client='ca-pub-1412302075585961'
        slot='7336196207'
        style={{ display: 'block' }}
        format='fluid'
        layoutKey='-gw-3+1f-3d+2z'
        responsive='true'
      />
      <Elements.Hr />
      <Bio />
      <PostNavigator pageContext={pageContext} />
      {!!disqusShortName && (
        <Disqus
          post={post}
          shortName={disqusShortName}
          siteUrl={siteUrl}
          slug={pageContext.slug}
        />
      )}
      {!!utterances && <Utterences repo={utterances} />}
    </Layout>
  )
}

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        siteUrl
        comment {
          disqusShortName
          utterances
        }
        sponsor {
          buyMeACoffeeId
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 280)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, yyyy")
      }
    }
  }
`
