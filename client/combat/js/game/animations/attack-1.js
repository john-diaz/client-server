ANIMATIONS['attack']['attack-1'] = function(event) {
  var action = event.action;
  var {
    damage,
    criticalStrike, 
    damageFormula
  } = action.outcome;

  var allCharacters = getAllCharacters();
  var agentId = event.character;
  var receiverId = event.receiver;

  var agent = allCharacters.find(function(c) { return c.id === agentId});
  var receiver = allCharacters.find(function(c) { return c.id === receiverId});

  if (!agent || !receiver) {
    throw new Error('Missing character or receiver when animating')
  }

  var agentSprite = agent.sprite;
  var receiverSprite = receiver.sprite;

  return new Promise(function(resolve) {
    timeline = playScreen.instance.tweens.createTimeline();

    var pos1 = agentSprite.x + 300;

    timeline.add({
      targets: agentSprite,
      x: pos1,
      duration: 350,
    });
    timeline.add({
      targets: agentSprite,
      x: pos1,
      duration: 1500,
    });
    timeline.add({
      targets: agentSprite,
      x: agentSprite.x,
      duration: 300,
    });

    var damageText

    EventChain()
    .then(function() {
      agentSprite.play('dwarf-walk');
    })
    .wait(350)
    .then(function() {
      // animate swing
      agentSprite.play('dwarf-attack');
    })
    .wait(300)
    .then(function() {
      // animate swing
      agentSprite.scaleX *= -1

      var textHeight = 18 // this should change based on the strength of the attack

      damageText = playScreen.instance.add.text(
        receiverSprite.x - receiverSprite.width - 20,
        receiverSprite.y - receiverSprite.height - 20,
        damageFormula,
        { fontSize: textHeight+'px', fill: '#fff' }
      );
    })
    .wait(1200)
    .then(function() {
      // animate walk back
      agentSprite.play('dwarf-walk');
    })
    .wait(290)
    .then(function() {
      // animate idle
      agentSprite.scaleX *= -1
      agentSprite.play('dwarf-idle');
    })
    .wait(10)
    .then(function() {
      // remove damage text
      playScreen.instance.add.tween({
        targets: damageText,
        ease: 'Sine.easeInOut',
        duration: 500,
        delay: 0,
        y: damageText.y - 20,
        alpha: {
          getStart: () => 1,
          getEnd: () => 0
        },
        onComplete: function() {
          damageText.destroy();
        }
      });
    })
    .setTimeline(timeline)
    .onDone(resolve)
    .play();
  });
}