exports.name = 'ADD_MEMBER_TO_CARD';

exports.exec = async data => {
  const _ = data.localeModule;
  return data.send({
    default: {
      title: _(data.invoker.id === data.member.id ? 'webhooks.card_add_self' : 'webhooks.card_add_member', {
        member: data.invoker.webhookSafeName,
        member2: data.member.webhookSafeName,
        card: data.util.cutoffText(data.card.name, 50)
      }),
      description: data.embedDescription(['member', 'card', 'list']),
    },
    small: {
      description: _(data.invoker.id === data.member.id ?
        'webhooks.card_add_self' : 'webhooks.card_add_member', {
        member: `[${data.invoker.webhookSafeName}](https://trello.com/${data.invoker.username})`,
        member2: `[${data.member.webhookSafeName}](https://trello.com/${data.member.username})`,
        card: `[${data.util.cutoffText(data.card.name, 25)}](https://trello.com/c/${data.card.shortLink})`
      })
    }
  });
};