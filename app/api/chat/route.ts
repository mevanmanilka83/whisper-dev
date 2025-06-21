import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(req: NextRequest) {
  let messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = []
  
  try {
    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
    
    const body = await req.json()
    messages = body.messages || []

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages are required and must be an array' },
        { status: 400 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are Whisper, a helpful AI assistant for the Whisper collaborative platform. You help users understand how to use zones, drops, collaboration features, and other platform functionality. Be friendly, concise, and helpful.'
        },
        ...messages
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      return NextResponse.json(
        { error: 'No response from OpenAI' },
        { status: 500 }
      )
    }

    return NextResponse.json({ response })
  } catch (error) {
    // Handle quota exceeded error with fallback response
    if (error instanceof Error) {
      if (error.message.includes('429') || error.message.includes('quota')) {
        // Get the last user message from the original request
        const lastUserMessage = messages?.findLast((msg) => msg.role === 'user')?.content || ''
        const messageContent = typeof lastUserMessage === 'string' ? lastUserMessage : ''
        
        // Simple fallback responses based on common questions
        let fallbackResponse = "I'm currently experiencing technical difficulties with my AI service. Here are some common ways to get help with Whisper:\n\n"
        
        if (messageContent.toLowerCase().includes('zone')) {
          fallbackResponse = "Zones are like your own little communities or spaces where you and others can share ideas and work together.\n\nThink of them as themed areas where you can create your own zone, join existing zones, share content, and collaborate with others.\n\nEach zone has its own description, rules, and community of members!"
        } else if (messageContent.toLowerCase().includes('drop')) {
          fallbackResponse = "Drops are the content you create and share within zones. They're like posts but with rich formatting.\n\nYou can use the rich text editor to format your content, add images to make your drops more engaging, share thoughts about any topic that fits the zone's theme, and engage with the community as others can boost your drops.\n\nTo create a drop, go to any zone you're a member of and click 'Create New Drop'!"
        } else if (messageContent.toLowerCase().includes('collaborat')) {
          fallbackResponse = "Collaboration in Whisper allows you to work with others.\n\nZone owners can invite you to collaborate on their zones, you can request to join zones you're interested in, zone owners can manage who can post and moderate, and collaborators help manage zone content and settings.\n\nCheck your settings page to see pending invitations and manage your collaborations!"
        } else if (messageContent.toLowerCase().includes('invit')) {
          fallbackResponse = "Invitations in Whisper work in two ways:\n\nZone owners can invite you to collaborate on their zones, giving you special permissions to help manage content and settings.\n\nYou can also request to join zones you're interested in, and zone owners can approve or decline your request.\n\nCheck your settings page to see all your pending invitations and join requests!"
        } else if (messageContent.toLowerCase().includes('profile') || messageContent.toLowerCase().includes('account')) {
          fallbackResponse = "Your profile shows your activity across all zones, including drops you've created and zones you're a member of.\n\nYou can view your profile by clicking on your name in the navigation, and manage your account settings through the settings page.\n\nYour profile is public, so others can see your activity and the zones you're part of!"
        } else if (messageContent.toLowerCase().includes('boost') || messageContent.toLowerCase().includes('like') || messageContent.toLowerCase().includes('upvote')) {
          fallbackResponse = "Boosting is Whisper's way of showing appreciation for great content!\n\nWhen you see a drop you like, you can boost it to show support. Boosted drops get more visibility in the zone and help creators know their content is appreciated.\n\nLook for the boost button on any drop to show your support!"
        } else if (messageContent.toLowerCase().includes('create') || messageContent.toLowerCase().includes('make')) {
          fallbackResponse = "Creating in Whisper is easy!\n\nTo create a zone: Click 'Create Zone' in the navigation, give it a name and description, and start building your community.\n\nTo create a drop: Go to any zone you're a member of and click 'Create New Drop' to share your thoughts with rich formatting and images.\n\nBoth zones and drops can be customized with your own style and rules!"
        } else if (messageContent.toLowerCase().includes('join') || messageContent.toLowerCase().includes('member')) {
          fallbackResponse = "Joining zones is simple!\n\nBrowse through available zones on the main page, click on any that interest you, and use the join button to become a member.\n\nSome zones may require approval from the owner, while others let you join immediately.\n\nOnce you're a member, you can create drops, boost content, and participate in the community!"
        } else if (messageContent.toLowerCase().includes('search') || messageContent.toLowerCase().includes('find')) {
          fallbackResponse = "Finding content in Whisper is straightforward!\n\nBrowse through zones on the main page to discover communities that interest you.\n\nWithin each zone, you can see all the drops created by members, organized by date.\n\nUse the navigation to explore different zones and find content that matches your interests!"
        } else if (messageContent.toLowerCase().includes('settings') || messageContent.toLowerCase().includes('manage')) {
          fallbackResponse = "Settings help you manage your Whisper experience!\n\nIn your settings page, you can view pending zone invitations, manage your join requests, see zones you own or collaborate on, and adjust your account preferences.\n\nThis is also where you'll find notifications about new invitations or activity in your zones!"
        } else if (messageContent.toLowerCase().includes('notification') || messageContent.toLowerCase().includes('alert')) {
          fallbackResponse = "Whisper keeps you updated with notifications!\n\nYou'll get notified about new zone invitations, approved join requests, and activity in zones you manage.\n\nCheck the notification badge in your user dropdown to see what's new, and visit your settings page to manage all your invitations and requests!"
        } else if (messageContent.toLowerCase().includes('share') || messageContent.toLowerCase().includes('link')) {
          fallbackResponse = "Sharing zones and profiles is easy!\n\nUse the copy link button on any zone page to share the zone URL with others.\n\nYou can also share your profile link so others can see your activity and the zones you're part of.\n\nShared links work for anyone, making it simple to invite friends to join your communities!"
        } else if (messageContent.toLowerCase().includes('whisper') || messageContent.toLowerCase().includes('platform') || messageContent.toLowerCase().includes('help') || messageContent.toLowerCase().includes('how') || messageContent.toLowerCase().includes('what')) {
          fallbackResponse = "Welcome to Whisper!\n\nHere's how to get started:\n\nCreate zones to build communities around topics you care about, share drops with rich content, collaborate by inviting others to help manage your zones, explore by joining zones created by others, and check your profile for activity and settings.\n\nWhat would you like to know more about - zones, drops, or collaboration?"
        } else {
          fallbackResponse = "I'm here to help you with Whisper platform questions! Ask me about zones, drops, collaboration, invitations, profiles, boosting, creating content, joining communities, settings, notifications, sharing, or any other Whisper features."
        }
        
        return NextResponse.json({ response: fallbackResponse })
      }
      
      if (error.message.includes('401')) {
        return NextResponse.json(
          { error: 'Invalid OpenAI API key' },
          { status: 401 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to process chat request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 