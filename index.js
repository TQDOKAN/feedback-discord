require("dotenv").config();
const Discord = require("discord.js");
const { createCanvas, loadImage } = require("canvas");
const Data = require("./Data");

// إنشاء عميل Discord
const client = new Discord.Client({
  intents: [Discord.IntentsBitField.Flags.Guilds, Discord.IntentsBitField.Flags.GuildMessages, Discord.IntentsBitField.Flags.MessageContent],
});

// عندما يكون البوت جاهزًا
client.on("ready", () => {
  console.log(client.user.tag);
  client.user.setPresence({
   /* activities: [
      {
        name: `تقييمات`,
        type: Discord.ActivityType.Watching,
      },
    ],*/
  });
});

// عند تلقي رسالة
client.on("messageCreate", async (message) => {
  if (message.content === Data.Prefix + "send") {
    // if (!message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) return;

    // إعداد أزرار التقييم
    let row = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder().setCustomId("star1").setLabel("⭐").setStyle(Discord.ButtonStyle.Secondary),
      new Discord.ButtonBuilder()
        .setCustomId("star2")

        .setLabel("⭐⭐")
        .setStyle(Discord.ButtonStyle.Secondary),
      new Discord.ButtonBuilder().setCustomId("star3").setLabel("⭐⭐⭐").setStyle(Discord.ButtonStyle.Secondary),
      new Discord.ButtonBuilder().setCustomId("star4").setLabel("⭐⭐⭐⭐").setStyle(Discord.ButtonStyle.Secondary),
      new Discord.ButtonBuilder().setCustomId("star5").setLabel("⭐⭐⭐⭐⭐").setStyle(Discord.ButtonStyle.Secondary)
    );
    // إعداد الرسالة الترويجية
    let embed = new Discord.EmbedBuilder()
      .setColor("#b45506") // يحدد لون الإطار الجانبي للرسالة
      .setTitle("تقييمك") // يضع عنوان للرسالة
      .setDescription("أختر تقييمك للمنتج") // يضيف وصفًا تحت العنوان
      .setThumbnail(message.guild.iconURL({ dynamic: true })); // يعرض صورة مصغرة، وهي شعار الخادم (server)
    message.channel.send({ embeds: [embed], components: [row] });
  }
});
// عند التفاعل مع الأزرار


client.on("interactionCreate", async (interaction) => {
  if (interaction.customId.startsWith("star")) {
    let starId = interaction.customId.slice(-1);
    
    // إنشاء الـ modal مع عنوان
    let modal = new Discord.ModalBuilder()
      .setCustomId(`thstar${starId}`)
      .setTitle(`تقييمك`);

        // إنشاء خانة نصية إضافية لتفاصيل إضافيةProduct
    let productInput = new Discord.TextInputBuilder()
      .setCustomId(`product${starId}`)
      .setLabel(`أسم المنتج`)
      .setStyle(Discord.TextInputStyle.Short)
      .setMinLength(1)
      .setMaxLength(50)
      .setPlaceholder(`أكتب هنا اسم المنتج`)
      .setRequired(true);

       // إنشاء أول خانة تقييم من 10 
     let taqyymInput = new Discord.TextInputBuilder()
      .setCustomId(`taqyym${starId}`)
      .setLabel(`تقييم من 10`)
      .setStyle(Discord.TextInputStyle.Short)
      .setMinLength(1)
      .setMaxLength(50)
      .setPlaceholder(` يرجى وضع من 1 الى 10 مثال 10/10`)
      .setRequired(true);
      
      
    // إنشاء أول خانة نصية للتقييم
    let textInput = new Discord.TextInputBuilder()
      .setCustomId(`fedd${starId}`)
      .setLabel(`تقييمك`)
      .setStyle(Discord.TextInputStyle.Paragraph)
      .setMinLength(1)
      .setMaxLength(150)
      .setPlaceholder(`يرجى وضع رأيك هنا`)
      .setRequired(true);

  
    // إضافة الخانات إلى الصفوف
    const row1 = new Discord.ActionRowBuilder().addComponents(productInput);
    const row2 = new Discord.ActionRowBuilder().addComponents(taqyymInput);
    const row3 = new Discord.ActionRowBuilder().addComponents(textInput);
    
    
    
    // إضافة الصفوف إلى الـ modal
    modal.addComponents(row1, row2, row3);

    // عرض الـ modal للمستخدم
    interaction.showModal(modal);
  }
});
// عند إرسال النموذج
const path = require('path');
const { registerFont, createCanvasFont, log } = require('canvas');

// تحميل الخط Cairo
const cairoFontPath = path.join(__dirname, './Fonts/', 'Cairo-Bold.ttf');
const cairoboldFontPath = path.join(__dirname, './Fonts/', 'Cairo-bold.ttf');
registerFont(cairoFontPath, { family: 'Cairo' });

//Cairo-Medium.ttf




client.on("interactionCreate", async (modal) => {
  if (modal.customId.startsWith("thstar")) {
    let starId = modal.customId.slice(-1);
    
    // الحصول على قيم الحقول المدخلة
    let msg = modal.fields.getTextInputValue(`fedd${starId}`);  // التقييم
    let product = modal.fields.getTextInputValue(`product${starId}`);  // اسم المنتج
    let taqyym = modal.fields.getTextInputValue(`taqyym${starId}`);  // التقييم من 1 الى 10
    
    // إنشاء اللوحة (Canvas)
    const canvas = createCanvas(1300, 530);  // مقاس المربع
    const ctx = canvas.getContext("2d");

    // تحميل صورة الخلفية
    const backgroundImage = await loadImage(`./Images/star${starId}.png`);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

 
      
       // الحصول على العضو من الخادم
    const member = modal.guild.members.cache.get(modal.user.id);
    
    // تحديد اللون بناءً على أعلى دور للمستخدم
    let userColor = "#ffffff";  // اللون الافتراضي (أبيض)

    // إذا كان العضو لديه دور مميز، نحصل على لون أعلى دور لديه
    if (member && member.roles.cache.size > 0) {
      const highestRole = member.roles.cache.sort((a, b) => b.position - a.position).first();
      
      // التأكد من أن الدور يحتوي على لون (ليس 0)
      if (highestRole && highestRole.color && highestRole.color !== 0) {
        userColor = `#${highestRole.color.toString(16).padStart(6, '0')}`;  // تعيين اللون من الدور
      }
    }

    // تعيين أنماط النص
    ctx.fillStyle = userColor;  // تعيين اللون استنادًا إلى دور المستخدم
    ctx.font = "bold 36px Cairo";  // استخدم خط "Cairo"
    ctx.textAlign = "right"; // محاذاة النص من اليمين
    ctx.textBaseline = "top";

    // إضافة اسم المستخدم
    ctx.fillText(modal.user.displayName, canvas.width - 265, 65); // محاذاة اسم المستخدم من اليمين

      
      // تعيين الأنماط لبقية النص
	ctx.fillStyle = "#ffffff";  // إعادة اللون الأبيض لبقية النص

      
      
    // إضافة عنوان التقييم على اللوحة
    ctx.font = "36px Cairo";  // استخدم خط "Cairo"
    ctx.fillText(product, canvas.width - 230, 210);  // محاذاة العنوان من اليمين

    // أضافة خانة التقييم من 1 الى 10
    ctx.fillText(taqyym, canvas.width - 230, 290);  // محاذاة العنوان من اليمين

    // تقسيم النص الطويل إلى أسطر
    const charactersPerLine = 50;  // عدد الحروف في كل سطر
    const paragraphs = [];
    for (let i = 0; i < msg.length; i += charactersPerLine) {
      paragraphs.push(msg.slice(i, i + charactersPerLine));
    }

    // رسم النص المقسّم
    paragraphs.forEach((paragraph, index) => {
      const yPos = 365 + index * 40;  // تحديد المسافة بين الأسطر
      ctx.fillText(paragraph, canvas.width - 215, yPos);  // محاذاة النص من اليمين
    });

    // تحميل ورسم أفتار المستخدم
    const userAvatar = await loadImage(modal.user.avatarURL({ extension: "png" }));
    const avatarCanvas = createCanvas(147, 147);
    const avatarCtx = avatarCanvas.getContext("2d");

    // رسم القص الدائري
    const radius = 73.5;
    avatarCtx.beginPath();
    avatarCtx.arc(radius, radius, radius, 0, Math.PI * 2, true);
    avatarCtx.closePath();
    avatarCtx.clip();
    avatarCtx.drawImage(userAvatar, 0, 0, avatarCanvas.width, avatarCanvas.height);

    // رسم الأفتار على اللوحة الرئيسية
    const avatarXPosition = canvas.width - 230; // إحداثيات X جديدة لجعل الأفتار في الجانب الأيمن
    ctx.drawImage(avatarCanvas, avatarXPosition, 30, 140, 140); // رسم الأفتار في الجهة اليمنى

    // إرسال المرفقات
    const attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), `Star${starId}.png`);
    let channel = client.channels.cache.get(Data.Channel);
    await modal.reply({ content: "شكرًا على ملاحظاتك", ephemeral: true }).then(async () => {
      await channel.send({ files: [attachment] });
    });
  }
});




client.login("TOKEN"); // token bot
