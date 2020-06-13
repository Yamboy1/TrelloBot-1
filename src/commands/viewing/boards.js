/*
 This file is part of TrelloBot.
 Copyright (c) Snazzah 2016 - 2019
 Copyright (c) Trello Talk Team 2019 - 2020

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const Command = require('../../structures/Command');
const GenericPager = require('../../structures/GenericPager');
const Util = require('../../util');

module.exports = class Boards extends Command {
  get name() { return 'boards'; }

  get _options() { return {
    aliases: ['viewboards', 'vbs'],
    cooldown: 2,
    permissions: ['auth'],
  }; }

  async exec(message, { args, _, trello, userData }) {
    const handle = await trello.handleResponse({
      response: await trello.getMember(userData.trelloID),
      client: this.client, message, _ });
    if (handle.stop) return;
    if (handle.response.status === 404) {
      await this.client.pg.models.get('user').removeAuth(message.author);
      return message.channel.createMessage(_('trello_response.unauthorized'));
    }

    const json = handle.body;

    if (json.boards.length) {
      const paginator = new GenericPager(this.client, message, {
        items: json.boards,
        _, header: _('boards.header'), itemTitle: 'words.trello_board.many',
        display: (item) => `${item.closed ? '🗃️ ' : ''}${item.subscribed ? '🔔 ' : ''}${
          item.starred ? '⭐ ' : ''}\`${item.shortLink}\` ${
          Util.cutoffText(Util.Escape.markdown(item.name), 50)}`
      });

      if (args[0])
        paginator.toPage(args[0]);

      return paginator.start(message.channel.id, message.author.id);
    } else {
      // Remove current board
      if (userData.currentBoard)
        await this.client.pg.models.get('user').update({ currentBoard: null },
          { where: { userID: message.author.id } });

      return message.channel.createMessage(_('boards.none'));
    }
  }

  get metadata() { return {
    category: 'categories.view',
  }; }
};