import 'dotenv/config';
import express from 'express';
import {
  ButtonStyleTypes,
  InteractionResponseFlags,
  InteractionResponseType,
  InteractionType,
  MessageComponentTypes,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { getRandomEmoji, DiscordRequest } from './utils.js';
import { getShuffledOptions, getResult } from './game.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// To keep track of our active games
const activeGames = {};

// Health check endpoint
app.get('/', async (req, res) => {
  return res.send('Discord bot is running!');
});

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  // Interaction id, type and data
  const { id, type, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" command
    if (name === 'test') {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.IS_COMPONENTS_V2,
          components: [
            {
              type: MessageComponentTypes.TEXT_DISPLAY,
              // Fetches a random emoji to send from a helper function
              content: `hello world ${getRandomEmoji()}`
            }
          ]
        },
      });
    }

    // "trade" command
    if (name === 'trade') {
      const COMPONENT_IDS = {
        ACTION_ROW: 1,
        BUTTON: 2,
        STRING_SELECT: 3,
        INPUT_TEXT: 4,
        USER_SELECT: 5,
        ROLE_SELECT: 6,
        MENTIONABLE_SELECT: 7,
        CHANNEL_SELECT: 8,
        SECTION: 9,
        TEXT_DISPLAY: 10,
        THUMBNAIL: 11,
        MEDIA_GALLERY: 12,
        FILE: 13,
        SEPARATOR: 14,
        CONTAINER: 17,
        LABEL: 18,
        FILE_UPLOAD: 19,
      }
      // Send a message into the channel where command was triggered from
      return res.send({
        "type": InteractionResponseType.MODAL,
        "data": {
          "custom_id": "trade_modal",
          "title": "Trade ARC Raiders Items",
          "components": [
            {
              "type": COMPONENT_IDS.LABEL,
              "label": "What's your favorite bug?",
              "component": {
                "type": COMPONENT_IDS.STRING_SELECT,
                "custom_id": "bug_string_select",
                "placeholder": "Choose...",
                "options": [
                  {
                    "label": "Ant",
                    "value": "ant",
                    "description": "(best option)",
                    "emoji": {
                      "name": "🐜"
                    }
                  },
                  {
                    "label": "Butterfly",
                    "value": "butterfly",
                    "emoji": {
                      "name": "🦋"
                    }
                  },
                  {
                    "label": "Caterpillar",
                    "value": "caterpillar",
                    "emoji": {
                      "name": "🐛"
                    }
                  }
                ]
              }
            },
            {
              "type": COMPONENT_IDS.LABEL,
              "label": "Why is it your favorite?",
              "description": "Please provide as much detail as possible!",
              "component": {
                "type": COMPONENT_IDS.INPUT_TEXT,
                "custom_id": "bug_explanation",
                "style": 2,
                "min_length": 1000,
                "max_length": 4000,
                "placeholder": "Write your explanation here...",
                "required": true
              }
            }
          ]
        }
      });
    }

    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: 'unknown command' });
  }

  // We only have one modal command so we dont need more IF statements to handle it
  if (type === InteractionType.MODAL_SUBMIT) {
    const memberId = req.body.member.user.id;
    const responses = req.body.data.components;
    console.log('modal submitted', memberId, responses);
    return res.status(200).json({ message: 'Modal submitted' });
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
