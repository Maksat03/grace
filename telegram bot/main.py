import logging
from aiogram import Bot, Dispatcher, executor
from aiogram.types import ContentType, Message


logging.basicConfig(level=logging.INFO)
bot = Bot(token="6110400554:AAFMH8jOOwYzq4IwVRX5CwScxQRwBz66ivY", parse_mode='HTML')
dp = Dispatcher(bot)


def save_tg_id(tg_id):
    tg_ids = []

    try:
        with open('tg_ids.txt', 'r') as file:
            for line in file:
                tg_ids.append(line.strip())
    except:
        pass

    if not (tg_id in tg_ids):
        with open('tg_ids.txt', 'w') as file:
            file.write("\n".join(tg_ids))


@dp.message_handler(commands=['start'])
async def welcome(msg: Message):
    await msg.answer("Теперь я буду уведомлять вас о новых заказах на сайте.")
    save_tg_id(msg.chat.id)


@dp.message_handler(content_types=ContentType.TEXT)
async def get_message(msg: Message):
    await msg.answer("Теперь я буду уведомлять вас о новых заказах на сайте.")
    save_tg_id(msg.chat.id)


if __name__ == "__main__":
    executor.start_polling(dp, skip_updates=True)
