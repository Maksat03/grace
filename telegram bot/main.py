import logging

from aiogram import Bot, Dispatcher, executor
from aiogram.types import ContentType, Message


logging.basicConfig(level=logging.INFO)
bot = Bot(token="6698535460:AAECdvYZGj_di-IXUtl9Fll0rE1l_WAZlE8", parse_mode='HTML')
dp = Dispatcher(bot)


@dp.message_handler(commands=['start'])
async def welcome(msg: Message):
    await msg.answer(msg.chat.id)


@dp.message_handler(content_types=ContentType.TEXT)
async def get_message(msg: Message):
    await msg.answer(msg.chat.id)


if __name__ == "__main__":
    executor.start_polling(dp, skip_updates=True)
