import { getPayload } from 'payload'
import config from '../src/payload.config'
import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const seedData = [
  {
    "courseId": "CP-VN01",
    "title": "Virtual Networks",
    "slug": "virtual-networks",
    "difficulty": "intermediate",
    "status": "published",
    "objective": {
      "root": {
        "type": "root",
        "format": "",
        "indent": 0,
        "version": 1,
        "children": [
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "type": "text",
                "text": "This course is designed to introduce students to the fundamentals of virtual networks or networking in cloud computing. You will learn about the various components and services offered by cloud providers to facilitate all your networking needs.",
                "version": 1
              }
            ]
          }
        ]
      }
    },
    "description": {
      "root": {
        "type": "root",
        "format": "",
        "indent": 0,
        "version": 1,
        "children": [
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "type": "text",
                "text": "Virtual networks in the cloud are isolated network environments that allow you to securely connect and manage your cloud resources. They provide a private space within a public cloud infrastructure, enabling you to create subnets, configure routing rules, and control network traffic.",
                "version": 1
              }
            ]
          }
        ]
      }
    },
    "topics": [
      { "topic": "IP Addressing Review" },
      { "topic": "Classless Inter-Domain Routing (CIDR)" },
      { "topic": "Virtual Private Cloud (VPC)" },
      { "topic": "Subnets" },
      { "topic": "Route Tables" },
      { "topic": "Internet Gateways" },
      { "topic": "Elastic IPs" },
      { "topic": "Network Address Translation (NAT) Gateways" },
      { "topic": "Endpoints" },
      { "topic": "VPC Peering" },
      { "topic": "Private Connection" },
      { "topic": "Transit Gateways" }
    ],
    "authorName": "Kris Fernando",
    "authorRole": "Author and Designer",
    "contentModel": "slides",
    "audioEnabled": true,
    "estimatedDuration": 25,
    "version": "1.0",
    "slides": [
      {
        "order": 1,
        "slideType": "tutorial",
        "slideTitle": "Welcome!",
        "bulletPoints": [
          { "point": "1. Press the Play button to listen to the content." },
          { "point": "2. Press the Stop button to stop the audio." },
          { "point": "3. Press the Backward arrow button to go to the previous slide." },
          { "point": "4. Press the Next arrow button to go to the next slide." }
        ],
        "image": 1 // This will be a placeholder ID, user needs to upload real images
      },
      {
        "order": 2,
        "slideType": "intro",
        "slideTitle": "Virtual Networks",
        "objective": "This course is designed to introduce students to the fundamentals of virtual networks or networking in cloud computing.",
        "authorName": "Kris Fernando",
        "authorRole": "Author and Designer",
        "image": 1
      },
      {
        "order": 3,
        "slideType": "topics",
        "slideTitle": "Introduction",
        "content": {
          "root": {
            "type": "root",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "type": "paragraph",
                "format": "",
                "indent": 0,
                "version": 1,
                "children": [
                  {
                    "type": "text",
                    "text": "Virtual networks in the cloud are isolated network environments that allow you to securely connect and manage your cloud resources.",
                    "version": 1
                  }
                ]
              }
            ]
          }
        },
        "topicsList": [
          { "topic": "IP Addressing Review" },
          { "topic": "Classless Inter-Domain Routing (CIDR)" },
          { "topic": "Virtual Private Cloud (VPC)" },
          { "topic": "Subnets" },
          { "topic": "Route Tables" },
          { "topic": "Internet Gateways" },
          { "topic": "Elastic IPs" },
          { "topic": "NAT Gateways" },
          { "topic": "Endpoints" },
          { "topic": "VPC Peering" },
          { "topic": "Private Connection" },
          { "topic": "Transit Gateways" }
        ],
        "image": 1
      },
      {
        "order": 4,
        "slideType": "content-list",
        "slideTitle": "IP Addressing Review",
        "subheadings": [
          {
            "label": "IPv4 vs. IPv6",
            "items": [
              { "point": "IPv4 is the older version using 32-bit addresses." },
              { "point": "IPv6 is the newer version using 128-bit addresses." }
            ]
          },
          {
            "label": "Classful vs. Classless Addressing",
            "items": [
              { "point": "Classful addressing divides IP addresses into classes." },
              { "point": "CIDR is a more flexible classless method." }
            ]
          }
        ],
        "image": 1
      },
      {
        "order": 5,
        "slideType": "outro",
        "slideTitle": "Congratulations!",
        "content": {
          "root": {
            "type": "root",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "type": "paragraph",
                "format": "",
                "indent": 0,
                "version": 1,
                "children": [
                  {
                    "type": "text",
                    "text": "You have completed the Virtual Networks course.",
                    "version": 1
                  }
                ]
              }
            ]
          }
        },
        "bulletPoints": [
          { "point": "1. Click on the Knowledge Check tab to take the quiz." },
          { "point": "2. Click on the Learning Material tab to return for help." },
          { "point": "3. Reach out in the Chat Groups for additional help." }
        ],
        "image": 1
      }
    ],
    "knowledgeCheck": {
      "allowPerQuestionSubmit": true,
      "playOnNextDefault": false,
      "showProgress": true,
      "passingScore": 100,
      "questions": [
        {
          "order": 1, "questionType": "mcq",
          "question": "1) What is the networking component Virtual Machines directly reside in?",
          "answers": [
            { "ansId": "a", "ans": "a) Virtual Private Cloud (VPC).", "isCorrect": false },
            { "ansId": "b", "ans": "b) Subnets.", "isCorrect": true },
            { "ansId": "c", "ans": "c) Availability Zones (AZ).", "isCorrect": false },
            { "ansId": "d", "ans": "d) Regions.", "isCorrect": false }
          ]
        },
        {
          "order": 2, "questionType": "mcq",
          "question": "2) Identify the largest CIDR Block?",
          "answers": [
            { "ansId": "a", "ans": "a) 0.0.0.0/0.", "isCorrect": true },
            { "ansId": "b", "ans": "b) 10.0.0.0/8.", "isCorrect": false },
            { "ansId": "c", "ans": "c) 10.0.0.0/16.", "isCorrect": false },
            { "ansId": "d", "ans": "d) 10.0.0.0/24.", "isCorrect": false }
          ]
        },
        {
          "order": 3, "questionType": "mcq",
          "question": "3) How can you make a Public Subnet?",
          "answers": [
            { "ansId": "a", "ans": "a) Add an Internet Gateway to the VPC.", "isCorrect": false },
            { "ansId": "b", "ans": "b) Add a Route for destination 0.0.0.0/0 with the Internet Gateway as the target.", "isCorrect": true },
            { "ansId": "c", "ans": "c) Set the Subnet as Public.", "isCorrect": false },
            { "ansId": "d", "ans": "d) Use a Transit Gateway.", "isCorrect": false }
          ]
        },
        {
          "order": 4, "questionType": "mcq",
          "question": "4) What is a dedicated private connection between the Cloud and a Data Center?",
          "answers": [
            { "ansId": "a", "ans": "a) Virtual Private Cloud (VPN).", "isCorrect": false },
            { "ansId": "b", "ans": "b) Direct Connect.", "isCorrect": true },
            { "ansId": "c", "ans": "c) Transit Gateway.", "isCorrect": false },
            { "ansId": "d", "ans": "d) VPC Peering.", "isCorrect": false }
          ]
        },
        {
          "order": 5, "questionType": "mcq",
          "question": "5) How do you control the flow of Traffic in your VPC?",
          "answers": [
            { "ansId": "a", "ans": "a) Internet Gateway (IGW).", "isCorrect": false },
            { "ansId": "b", "ans": "b) NAT Gateway (NAT).", "isCorrect": false },
            { "ansId": "c", "ans": "c) Transit Gateway.", "isCorrect": false },
            { "ansId": "d", "ans": "d) Route Tables.", "isCorrect": true }
          ]
        },
        {
          "order": 6, "questionType": "completion",
          "completionMessage": "Congratulations! Your Knowledge is 100%",
          "completionSubtext": {
            "root": {
              "type": "root",
              "format": "",
              "indent": 0,
              "version": 1,
              "children": [
                {
                  "type": "paragraph",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "children": [
                    {
                      "type": "text",
                      "text": "You can now proceed to the next course. Click on the Home Icon at the top left of your screen. Good luck! Keep learning and growing!",
                      "version": 1
                    }
                  ]
                }
              ]
            }
          }
        }
      ]
    }
  }
]

const seed = async () => {
  const payload = await getPayload({ config })

  console.log('Seeding data...')

  // Create a placeholder media item first if none exists
  let mediaId: string | number = 1
  try {
    const media = await payload.find({
      collection: 'media',
      limit: 1,
    })
    if (media.totalDocs > 0) {
      mediaId = media.docs[0].id
    } else {
      console.warn('No media found. Please upload at least one image to Payload first for the seed to work correctly with images.')
    }
  } catch (err) {
    console.error('Error finding media:', err)
  }

  for (const courseData of seedData) {
    try {
      // Update slide images to use real media ID if found
      const slidesWithMedia = courseData.slides.map(slide => ({
        ...slide,
        image: mediaId
      }))

      await payload.create({
        collection: 'courses',
        data: {
          ...courseData,
          slides: slidesWithMedia,
        } as any,
      })
      console.log(`Successfully seeded course: ${courseData.title}`)
    } catch (err: any) {
      console.error(`Failed to seed course: ${courseData.title}`, err.message)
    }
  }

  console.log('Seed finished.')
  process.exit(0)
}

seed()
