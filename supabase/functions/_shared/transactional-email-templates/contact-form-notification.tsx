import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Stir & Simmer'

interface ContactFormNotificationProps {
  name?: string
  email?: string
  message?: string
  submittedAt?: string
}

const ContactFormNotificationEmail = ({
  name,
  email,
  message,
  submittedAt,
}: ContactFormNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New contact form submission from {name || 'a visitor'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New message from your website</Heading>
        <Text style={intro}>
          Someone just got in touch via the contact form on {SITE_NAME}.
        </Text>

        <Section style={detailsBox}>
          <Text style={label}>From</Text>
          <Text style={value}>{name || 'Not provided'}</Text>

          <Hr style={divider} />

          <Text style={label}>Email</Text>
          <Text style={value}>{email || 'Not provided'}</Text>

          {submittedAt ? (
            <>
              <Hr style={divider} />
              <Text style={label}>Submitted</Text>
              <Text style={value}>{submittedAt}</Text>
            </>
          ) : null}
        </Section>

        <Section style={messageBox}>
          <Text style={label}>Message</Text>
          <Text style={messageText}>{message || '(No message provided)'}</Text>
        </Section>

        <Text style={footer}>
          Reply directly to {email ? email : 'the sender'} to respond.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactFormNotificationEmail,
  subject: (data: Record<string, any>) =>
    `New contact form message${data?.name ? ` from ${data.name}` : ''}`,
  to: 'hello@stirandsimmer.co.uk',
  displayName: 'Contact form notification',
  previewData: {
    name: 'Jane Smith',
    email: 'jane@example.com',
    message: 'Hi! I loved your carbonara recipe — could you suggest a wine pairing?',
    submittedAt: '1 May 2026, 14:32',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
}

const container = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '32px 24px',
}

const h1 = {
  fontSize: '24px',
  fontWeight: '600',
  color: '#1a1a1a',
  margin: '0 0 12px',
  letterSpacing: '-0.01em',
}

const intro = {
  fontSize: '15px',
  color: '#55575d',
  lineHeight: '1.6',
  margin: '0 0 28px',
}

const detailsBox = {
  backgroundColor: '#fafafa',
  borderRadius: '8px',
  padding: '20px 24px',
  margin: '0 0 16px',
}

const messageBox = {
  backgroundColor: '#fafafa',
  borderRadius: '8px',
  padding: '20px 24px',
  margin: '0 0 28px',
}

const label = {
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  color: '#8a8a8a',
  fontWeight: '600',
  margin: '0 0 4px',
}

const value = {
  fontSize: '15px',
  color: '#1a1a1a',
  margin: '0 0 4px',
  lineHeight: '1.5',
}

const messageText = {
  fontSize: '15px',
  color: '#1a1a1a',
  lineHeight: '1.7',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
}

const divider = {
  borderColor: '#e5e5e5',
  margin: '12px 0',
}

const footer = {
  fontSize: '13px',
  color: '#8a8a8a',
  margin: '0',
  fontStyle: 'italic' as const,
}
