import {
  Events,
  Interaction,
  ModalSubmitInteraction,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';

export const name = Events.InteractionCreate;
export const once = false;

export async function execute(interaction: Interaction) {
  // Handle slash commands
  if (interaction.isChatInputCommand()) {
    const command = (interaction.client as any).commands.get(
      interaction.commandName
    );

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction as ChatInputCommandInteraction);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}:`, error);
      const errorMessage = {
        content: 'There was an error while executing this command!',
        ephemeral: true,
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    }
  }

  // Handle modal submissions
  if (interaction.isModalSubmit()) {
    const modalInteraction = interaction as ModalSubmitInteraction;

    // Handle the form modal
    if (modalInteraction.customId === 'formModal') {
      const name = modalInteraction.fields.getTextInputValue('nameInput');
      const message = modalInteraction.fields.getTextInputValue(
        'messageInput'
      );

      // Create an embed with the collected data
      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('Form Submission')
        .addFields(
          {
            name: 'Name',
            value: name,
            inline: false,
          },
          {
            name: 'Message',
            value: message,
            inline: false,
          }
        )
        .setTimestamp()
        .setFooter({
          text: `Submitted by ${modalInteraction.user.tag}`,
        });

      // Reply with the collected information (posts to channel)
      await modalInteraction.reply({
        embeds: [embed],
      });
    }
  }
}

