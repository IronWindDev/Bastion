/**
 * @file claim command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

let claimedUsers = [];
const specialIDs = require('../../data/specialIDs.json');

exports.run = (Bastion, message) => {
  if (Bastion.credentials.guildId && Bastion.credentials.guildId instanceof Array && Bastion.credentials.guildId.length > 0) {
    if (!Bastion.credentials.guildId.includes(message.guild.id)) {
      return message.channel.send({
        embed: {
          color: Bastion.colors.RED,
          description: 'You can claim your daily rewards only in the official server. Here\'s an invite link to the official server: https://discord.gg/fzx8fkt'
        }
      }).catch(e => {
        Bastion.log.error(e);
      });
    }
  }

  if (!claimedUsers.includes(message.author.id)) {
    let rewardAmount;

    if (message.member.roles.has(specialIDs.patronsRole)) {
      rewardAmount = Bastion.functions.getRandomInt(50, 70);
    }
    else if (message.member.roles.has(specialIDs.donorsRole)) {
      rewardAmount = Bastion.functions.getRandomInt(30, 50);
    }
    else {
      rewardAmount = Bastion.functions.getRandomInt(10, 30);
    }

    Bastion.emit('userDebit', message.author, rewardAmount);
    claimedUsers.push(message.author.id);
    setTimeout(() => {
      claimedUsers.splice(claimedUsers.indexOf(message.author.id), 1);
    }, 24 * 60 * 60 * 1000);

    /**
    * Send a message in the channel to let the user know that the operation was successful.
    */
    message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: `${message.author} You've claimed your daily reward.`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });

    /**
    * Let the user know by DM that their account has been debited.
    */
    message.author.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: `Your account has been debited with **${rewardAmount}** Bastion Currencies.`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
  else {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'cooldown'), Bastion.strings.error(message.guild.language, 'claimCooldown', true, message.author), message.channel);
  }
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'claim',
  botPermission: '',
  userPermission: '',
  usage: 'claim',
  example: []
};
