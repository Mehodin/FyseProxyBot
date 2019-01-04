import HttpsProxyAgent from "./https-proxy-agent";
import { Client, RichEmbed } from "discord.js";
import users from "./assets/users.json";
import request from "request-promise";
import { Extract } from "unzipper";
import fetch from "node-fetch";
import WebSocket from 'ws';
import urban from "urban";
import * as fs from "fs";
const bot = new Client();

var ownerID = "499834832059367435";
var embed = new RichEmbed();
var prefix = "fy";
var isChecking = null;

bot.on("ready", () => {
  console.log("ready");
  bot.on("message", async msg => {
    if (!users[msg.author.id])
      users[msg.author.id] = {
        name: msg.author.username,
        whitelisted: false,
        coins: 0
      };
    users[msg.author.id].coins++;
    await fs.writeFile(
      "./assets/users.json",
      JSON.stringify(users, null, 2),
      err => {
        if (err) console.log(err);
      }
    );
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;
    const args = msg.content.substring(prefix.length).split(" ");

    switch (args[0].toLowerCase()) {
      case "coins":
        if (msg.author.id !== ownerID) return msg.react("❎");
        if (!users[msg.mentions.users.first().id])
          users[msg.mentions.users.first().id] = {
            name: msg.author.username,
            whitelisted: false,
            coins: 0
          };
        users[msg.mentions.users.first().id].coins += parseInt(args[2]);
        fs.writeFile(
          "./assets/users.json",
          JSON.stringify(users, null, 2),
          err => {
            if (err) console.log(err);
          }
        );
        msg.react("✅");
        break;
      case "urban":
        if (!args[1]) return;
        embed = new RichEmbed();
        urban(
          args
            .slice(1)
            .join(" ")
            .toLowerCase()
        ).first(res => {
          if (!res)
            return msg.channel.send({
              embed: {
                color: Math.floor(Math.random() * 16777214) + 1,
                description: "No results"
              }
            });
          embed.setTitle(
            `${res.word} | :thumbsup: ${res.thumbs_up} | :thumbsdown: ${
              res.thumbs_down
            }`
          );
          embed.setDescription(res.definition.substring(0, 2048));
          res.example
            ? embed.addField(res.example.substring(0, 256), `-${res.author}`)
            : undefined;
          embed.setColor("RANDOM");
          msg.channel.send(embed);
        });
        break;
      case "ping":
        msg.channel.send({
          embed: {
            color: Math.floor(Math.random() * 16777214) + 1,
            description: `${parseInt(bot.ping)}ms`
          }
        });
        break;
      case "profile":
        if (args[1]) {
          if (!msg.mentions.users.first()) return;
          if (!users[msg.mentions.users.first().id])
            users[msg.mentions.users.first().id] = {
              name: msg.author.username,
              coins: 0,
              isAdmin: false
            };
          msg.channel.send({
            embed: {
              color: Math.floor(Math.random() * 16777214) + 1,
              footer: {
                icon_url: msg.mentions.users.first().avatarURL,
                text: msg.mentions.users.first().username
              },
              description: `ID: ${msg.mentions.users.first().id}\nName: ${
                msg.mentions.users.first().username
              }\nCoins: ${
                users[msg.mentions.users.first().id].coins
              }\nWhitelisted: ${
                users[msg.mentions.users.first().id].whitelisted
              }`
            }
          });
        } else {
          msg.channel.send({
            embed: {
              color: Math.floor(Math.random() * 16777214) + 1,
              footer: {
                icon_url: msg.author.avatarURL,
                text: msg.author.username
              },
              description: `ID: ${msg.author.id}\nName: ${
                msg.author.username
              }\nCoins: ${users[msg.author.id].coins}\nWhitelisted: ${
                users[msg.author.id].whitelisted
              }`
            }
          });
        }
        break;
      case "unwhitelist":
        if (msg.author.id !== ownerID) return;
        if (!msg.mentions.users.first()) return;
        if (!users[msg.mentions.users.first().id])
          users[msg.mentions.users.first().id] = {
            name: msg.author.username,
            whitelisted: false,
            coins: 0
          };
        users[msg.mentions.users.first().id].whitelisted = false;
        fs.writeFile(
          "./assets/users.json",
          JSON.stringify(users, null, 2),
          err => {
            if (err) console.log(err);
          }
        );
        msg.react("✅");
        break;
      case "whitelist":
        if (msg.author.id !== ownerID) return;
        if (!msg.mentions.users.first()) return;
        if (!users[msg.mentions.users.first().id])
          users[msg.mentions.users.first().id] = {
            name: msg.author.username,
            whitelisted: false,
            coins: 0
          };
        users[msg.mentions.users.first().id].whitelisted = true;
        fs.writeFile(
          "./assets/users.json",
          JSON.stringify(users, null, 2),
          err => {
            if (err) console.log(err);
          }
        );
        msg.react("✅");
        break;
      case "proxies":
        if (!args[1])
          return msg.channel.send({
            embed: {
              color: Math.floor(Math.random() * 16777214) + 1,
              description:
                "**fyproxies socks1** \nTo get socks5 proxies from Socks Source 1\n**fyproxies socks2** \nTo get socks5 proxies from Socks Source 2\n**fyproxies ssl** \nTo get https proxies from SSL Source 1\n**fyproxies sslchecked** \nTo get **checked** https proxies from SSL Source 1"
            }
		  });
      case "invite":
        if (!args[1])
          return msg.channel.send({
            embed: {
              color: Math.floor(Math.random() * 16777214) + 1,
              description:
                "**Want me in your server?** \n Use this link! \nhttps://discordapp.com/oauth2/authorize?&client_id=505348780749750292&scope=bot&permissions=0"
            }
		  });
	  case "help":
		if (!args[1])
          return msg.channel.send({
            embed: {
              color: Math.floor(Math.random() * 16777214) + 1,
              description:
				"__You want help, eh? Find all my commands and info about 'em below!__ \n**REMEMBER, THE BOT PREFIX IS `fy`.** \n\n - **Donate** [Shows donation addresses to support the project]\n - **Help** [Shows bot commands]\n - **Invite** [Shows invite link for bot] \n- **Ping** [Speed/latency test] \n- **Profile** [Shows the amount of coins you have] \n- **Proxies** [Shows list of available proxies] \n- **Proxies PROXYTYPE** [Retrieves a list of proxies that are of the specified type] \n- **Urban WORD** [Shows definition of the word `SOURCE: Urban Dictionary`] \n\n**Need support? Join our official server using this invite!** https://discord.gg/QjF2PnT "
		    }
		  });
	  case "donate":
		if (!args[1])
          return msg.channel.send({
            embed: {
              color: Math.floor(Math.random() * 16777214) + 1,
              description:
			    "**Wanna donate to support the project?** \n**Use the donation addresses below!** \n\n-Bitcoin: `1AefV1hAP6Dywb8tUboypZmjBhY5rfRZHQ` \n-Bitcoin Gold: `GJAezovAXSaeA1TMfwqeT86ye1YCm3sAuX` \n-Ethereum: `0x8A40dC0F722480D3292073154484444D2f882d36` \n\nEach donation helps support the project! \nWhen you donate a minimum of $3, you receive whitelist, which means you don't require coins for proxy calls!"
   		    }
		  });
        const ssl = "http://www.sslproxies24.top/search?max-results=1";
        const fast = "http://www.live-socks.net/search?max-results=1";
        const vip = "http://www.vipsocks24.net/search?max-results=1";
        switch (args[1].toLowerCase()) {
          case "sslchecked":
            if (
              users[msg.author.id].coins < 100 &&
              users[msg.author.id].whitelisted == false
            ) {
              return msg.channel.send({
                embed: {
                  color: Math.floor(Math.random() * 16777214) + 1,
                  description: "You need 100 coins to get proxies. \nCoins are obtainable through chatting on servers that I'm in! \nEvery message that you send gives you 1 coin. \n**If you donate $1 or more, you get `WHITELISTED`, which means you don't require coins to get proxies! Find donation addresses using the command `fydonate`, and once your donation is sent, DM Fyse#0683!**"
                }
              });
            }
            if (isChecking) return msg.react("❎");
            if (!users[msg.author.id].whitelisted) {
              users[msg.author.id].coins -= 100;
              await fs.writeFile(
                "./assets/users.json",
                JSON.stringify(users, null, 2),
                err => {
                  if (err) console.log(err);
                }
              );
            }
            res = await fetch(ssl);
            html = await res.text();
            latest_url = html.match(
              /class='jump-link'>\n*<a\s*href='(.*?)'>/i
            )[1];
            await request(latest_url, (err, res, body) => {
              if (err || !res || res.statusCode !== 200)
                return msg.channel.send({
                  embed: {
                    color: Math.floor(Math.random() * 16777214) + 1,
                    description: "Failed to send a request"
                  }
                });
              let match = body.match(
                /https:..drive.google.com.uc.export=download&id=.+?(?=")/
              );
              if (!match) return msg.react("❎");
              let regex = match[0];
              let file = "ssl";
              let socks = false;
              let check = true;
              proxyDownloader(msg, regex, file, socks, check);
            });
            break;
          case "socks1":
            if (
              users[msg.author.id].coins < 100 &&
              users[msg.author.id].whitelisted == false
            ) {
              return msg.channel.send({
                embed: {
                  color: Math.floor(Math.random() * 16777214) + 1,
                  description: "You need 100 coins to get proxies. \nCoins are obtainable through chatting on servers that I'm in! \nEvery message that you send gives you 1 coin. \n**If you donate $3 or more, you get `WHITELISTED`, which means you don't require coins to get proxies! Find donation addresses using the command `fydonate`, and once your donation is sent, DM Fyse#0683!**"
                }
              });
            }
            if (!users[msg.author.id].whitelisted) {
              users[msg.author.id].coins -= 100;
              await fs.writeFile(
                "./assets/users.json",
                JSON.stringify(users, null, 2),
                err => {
                  if (err) console.log(err);
                }
              );
            }
            var res = await fetch(vip);
            var html = await res.text();
            var latest_url = html.match(
              /class='jump-link'>\n*<a\s*href='(.*?)'>/i
            )[1];
            await request(latest_url, (err, res, body) => {
              if (err || !res || res.statusCode !== 200)
                return msg.channel.send({
                  embed: {
                    color: Math.floor(Math.random() * 16777214) + 1,
                    description: "Failed to send a request"
                  }
                });
              let match = body.match(
                /https:..drive.google.com.uc.export=download&id=.+?(?=")/
              );
              if (!match) return msg.react("❎");
              let regex = match[0];
              let file = "vipsocks";
              let socks = true;
              proxyDownloader(msg, regex, file, socks);
            });
            break;
          case "socks2":
            if (
              users[msg.author.id].coins < 100 &&
              users[msg.author.id].whitelisted == false
            ) {
              return msg.channel.send({
                embed: {
                  color: Math.floor(Math.random() * 16777214) + 1,
                  description: "You need 100 coins to get proxies. \nCoins are obtainable through chatting on servers that I'm in! \nEvery message that you send gives you 1 coin. \n**If you donate $3 or more, you get `WHITELISTED`, which means you don't require coins to get proxies! Find donation addresses using the command `fydonate`, and once your donation is sent, DM Fyse#0683!**"
                }
              });
            }
            if (!users[msg.author.id].whitelisted) {
              users[msg.author.id].coins -= 100;
              await fs.writeFile(
                "./assets/users.json",
                JSON.stringify(users, null, 2),
                err => {
                  if (err) console.log(err);
                }
              );
            }
            res = await fetch(fast);
            html = await res.text();
            latest_url = html.match(
              /class='jump-link'>\n*<a\s*href='(.*?)'>/i
            )[1];
            await request(latest_url, (err, res, body) => {
              if (err || !res || res.statusCode !== 200)
                return msg.channel.send({
                  embed: {
                    color: Math.floor(Math.random() * 16777214) + 1,
                    description: "Failed to send a request"
                  }
                });
              let match = body.match(
                /https:..drive.google.com.uc.export=download&id=.+?(?=")/
              );
              if (!match) return msg.react("❎");
              let regex = match[0];
              let file = "socks24_fast";
              let socks = true;
              proxyDownloader(msg, regex, file, socks);
            });
            break;
          case "ssl":
            if (
              users[msg.author.id].coins < 100 &&
              users[msg.author.id].whitelisted == false
            ) {
              return msg.channel.send({
                embed: {
                  color: Math.floor(Math.random() * 16777214) + 1,
                  description: "You need 100 coins to get proxies. \nCoins are obtainable through chatting on servers that I'm in! \nEvery message that you send gives you 1 coin. \n**If you donate $3 or more, you get `WHITELISTED`, which means you don't require coins to get proxies! Find donation addresses using the command `fydonate`, and once your donation is sent, DM Fyse#0683!**"
                }
              });
            }
            if (!users[msg.author.id].whitelisted) {
              users[msg.author.id].coins -= 100;
              await fs.writeFile(
                "./assets/users.json",
                JSON.stringify(users, null, 2),
                err => {
                  if (err) console.log(err);
                }
              );
            }
            res = await fetch(ssl);
            html = await res.text();
            latest_url = html.match(
              /class='jump-link'>\n*<a\s*href='(.*?)'>/i
            )[1];
            await request(latest_url, (err, res, body) => {
              if (err || !res || res.statusCode !== 200)
                return msg.channel.send({
                  embed: {
                    color: Math.floor(Math.random() * 16777214) + 1,
                    description: "Failed to send a request"
                  }
                });
              let match = body.match(
                /https:..drive.google.com.uc.export=download&id=.+?(?=")/
              );
              if (!match) return msg.react("❎");
              let regex = match[0];
              let file = "ssl";
              let socks = false;
              proxyDownloader(msg, regex, file, socks);
            });
        }
        break;
    }
  });
});

function proxyChecker(proxy) {
  fs.truncate("./assets/proxies/checked_proxies.txt", 0, err => {
    if (err) throw err;
  });
  let wss = [];
  const ws = new WebSocket("ws://echo.websocket.org", {
    agent: new HttpsProxyAgent(`http://${proxy}`)
  });
  wss.push(ws);
  ws.onopen = function() {
    if (ws.readyState === WebSocket.OPEN) {
      fs.appendFile(
        "./assets/proxies/checked_proxies.txt",
        `${proxy}\n`,
        err => {
          if (err) throw err;
        }
      );
      this.close();
    }
  };
  ws.onerror = function() {
    this.close();
  };
  setTimeout(() => {
    for (const ws of wss) {
      ws.close();
    }
  }, 120 * 1000);
}

async function proxyDownloader(msg, url, site, socks, check) {
  msg.react("✅");
  await request({ url: url, encoding: null }, (err, res, file) => {
    if (err || !res || res.statusCode !== 200)
      return msg.channel.send({
        embed: {
          color: Math.floor(Math.random() * 16777214) + 1,
          description: "Failed to send a request"
        }
      });
    fs.writeFile(`./assets/proxies/proxies.zip`, file, err => {
      if (err) throw err;
      fs.createReadStream(`./assets/proxies/proxies.zip`).pipe(
        Extract({ path: "assets/proxies" })
      );
      if (check) {
        isChecking = true;
        msg.author.send({
          embed: {
            color: Math.floor(Math.random() * 16777214) + 1,
            description: `Scraped: ${
              fs
                .readFileSync(`./assets/proxies/${site}.txt`, "utf8")
                .split("\n").length
            } Proxies\nChecking Proxies\nTimeout: 125 Seconds`
          }
        });
        let proxies = fs
          .readFileSync(`./assets/proxies/${site}.txt`, "utf8")
          .split("\n");
        proxies.forEach(proxy => {
          proxyChecker(proxy);
        });
        setTimeout(() => {
          msg.author.send({
            embed: {
              color: Math.floor(Math.random() * 16777214) + 1,
              description: `Working Proxies: ${
                fs
                  .readFileSync(`./assets/proxies/checked_proxies.txt`, "utf8")
                  .split("\n").length
              }`,
              files: [`./assets/proxies/checked_proxies.txt`]
            }
          });
          isChecking = false;
        }, 125 * 1000);
      } else {
        fs.rename(
          `assets/proxies/${site}.txt`,
          `assets/proxies/${socks ? "socks5" : "ssl"}_proxies.txt`,
          err => {
            if (err) console.log("ERROR: " + err);
          }
        );
        try {
          msg.author.send({
            embed: {
              color: Math.floor(Math.random() * 16777214) + 1,
              description: `Proxies: ${
                fs
                  .readFileSync(
                    `./assets/proxies/${socks ? "socks5" : "ssl"}_proxies.txt`,
                    "utf8"
                  )
                  .split("\n").length
              }`,
              files: [
                `./assets/proxies/${socks ? "socks5" : "ssl"}_proxies.txt`
              ]
            }
          });
        } catch (e) {}
      }
    });
  });
}

bot.login("NTMwODAzMTAwMTczMjA1NTA0.DxEscA.ADnHO5-QrH3Lp5iC1iNYreG9--4");