import {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ChatInputCommandInteraction,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('form')
  .setDescription('Opens a form modal to submit information');

export async function execute(interaction: ChatInputCommandInteraction) {
  // Create the modal
  const modal = new ModalBuilder()
    .setCustomId('formModal')
    .setTitle('Custom Form');

  // Create the short text input (nameInput)
  const nameInput = new TextInputBuilder()
    .setCustomId('nameInput')
    .setLabel('Name')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Enter your name')
    .setRequired(true)
    .setMaxLength(100);

  // Create the paragraph input (messageInput)
  const messageInput = new TextInputBuilder()
    .setCustomId('messageInput')
    .setLabel('Message')
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder('Enter your message')
    .setRequired(true)
    .setMaxLength(1000);

  // Create action rows (each row can contain one text input)
  const firstActionRow =
    new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
  const secondActionRow =
    new ActionRowBuilder<TextInputBuilder>().addComponents(messageInput);

  // Add action rows to modal
  modal.addComponents(firstActionRow, secondActionRow);

  // Show the modal to the user
  await interaction.showModal(modal);
}

