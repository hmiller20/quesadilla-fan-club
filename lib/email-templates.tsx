import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface NewPostEmailProps {
  firstName: string
  postTitle: string
  postTeaser?: string
  postUrl: string
  unsubscribeUrl: string
}

export const NewPostEmail = ({
  firstName,
  postTitle,
  postTeaser,
  postUrl,
  unsubscribeUrl,
}: NewPostEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New post on Quesadilla Fan Club: {postTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Hey {firstName}!</Heading>
          <Text style={text}>
            I put some more words on the internet. Hot off the press. Come and get 'em while they're still warm.
          </Text>
          <Heading style={h2}>{postTitle}</Heading>
          {postTeaser && <Text style={text}>{postTeaser}</Text>}
          <Link href={postUrl} style={button}>
            Read the post
          </Link>
          <Text style={footer}>
            You're receiving this email because you signed up to receive Quesadilla Fan Club email alerts.
            <br />
            <Link href={unsubscribeUrl} style={link}>
              Unsubscribe/I Hate Quesadillas
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
}

const h2 = {
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '24px 0',
  padding: '0',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const button = {
  backgroundColor: '#4CAF50',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
  margin: '24px 0',
}

const link = {
  color: '#4CAF50',
  textDecoration: 'underline',
}

const footer = {
  color: '#898989',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '24px 0',
} 