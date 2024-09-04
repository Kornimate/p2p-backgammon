import os, sys, io
import M5
from M5 import *
from hardware import *
from unit import TVOCUnit
import time



co2_now = None
label_tvoc = None
co2_min = None
co2_max = None
tvoc_min = None
tvoc_max = None
Co2_title = None
TVOC_title = None
Last_update = None
update_time = None
i2c0 = None
tvoc_0 = None


import random

cur_val = None
cur_max = None
hour = None
tvoc_mesaurement = None
current_time = None
r_code = None
co2_measurement = None
g_code = None
max_tvoc = None
last_update = None
b_code = None
max_co2 = None
min_tvoc = None
Background_color = None
min_co2 = None
Text_color = None
num_of_mesurements = None
minute = None
second = None

# Describe this function...
def Measure():
  global cur_val, cur_max, hour, tvoc_mesaurement, current_time, r_code, co2_measurement, g_code, max_tvoc, last_update, b_code, max_co2, min_tvoc, Background_color, min_co2, Text_color, num_of_mesurements, minute, second, co2_now, label_tvoc, co2_min, co2_max, tvoc_min, tvoc_max, Co2_title, TVOC_title, Last_update, update_time, i2c0, tvoc_0
  tvoc_mesaurement = tvoc_0.tvoc()
  co2_measurement = tvoc_0.co2eq()
  update_max()
  Update_display()

# Describe this function...
def update_every_min():
  global cur_val, cur_max, hour, tvoc_mesaurement, current_time, r_code, co2_measurement, g_code, max_tvoc, last_update, b_code, max_co2, min_tvoc, Background_color, min_co2, Text_color, num_of_mesurements, minute, second, co2_now, label_tvoc, co2_min, co2_max, tvoc_min, tvoc_max, Co2_title, TVOC_title, Last_update, update_time, i2c0, tvoc_0
  current_time = time.ticks_ms()
  if current_time >= last_update + 5000:
    last_update = current_time
    Measure()

# Describe this function...
def Change_color():
  global cur_val, cur_max, hour, tvoc_mesaurement, current_time, r_code, co2_measurement, g_code, max_tvoc, last_update, b_code, max_co2, min_tvoc, Background_color, min_co2, Text_color, num_of_mesurements, minute, second, co2_now, label_tvoc, co2_min, co2_max, tvoc_min, tvoc_max, Co2_title, TVOC_title, Last_update, update_time, i2c0, tvoc_0
  r_code = random.randint(100, 255)
  g_code = random.randint(100, 255)
  b_code = random.randint(100, 255)
  Background_color = (r_code << 16) | (g_code << 8) | b_code
  Text_color = 0x000000
  Widgets.fillScreen(Background_color)
  Co2_title.setColor(Text_color, Background_color)
  TVOC_title.setColor(Text_color, Background_color)
  co2_now.setColor(Text_color, Background_color)
  co2_min.setColor(Text_color, Background_color)
  co2_max.setColor(Text_color, Background_color)
  label_tvoc.setColor(Text_color, Background_color)
  tvoc_min.setColor(Text_color, Background_color)
  tvoc_max.setColor(Text_color, Background_color)
  Last_update.setColor(Text_color, Background_color)
  update_time.setColor(Text_color, Background_color)

# Describe this function...
def check_for_new_max(cur_val, cur_max):
  global hour, tvoc_mesaurement, current_time, r_code, co2_measurement, g_code, max_tvoc, last_update, b_code, max_co2, min_tvoc, Background_color, min_co2, Text_color, num_of_mesurements, minute, second, co2_now, label_tvoc, co2_min, co2_max, tvoc_min, tvoc_max, Co2_title, TVOC_title, Last_update, update_time, i2c0, tvoc_0
  if cur_val >= cur_max:
    return True
  return False

# Describe this function...
def check_for_new_min(cur_val, cur_max):
  global hour, tvoc_mesaurement, current_time, r_code, co2_measurement, g_code, max_tvoc, last_update, b_code, max_co2, min_tvoc, Background_color, min_co2, Text_color, num_of_mesurements, minute, second, co2_now, label_tvoc, co2_min, co2_max, tvoc_min, tvoc_max, Co2_title, TVOC_title, Last_update, update_time, i2c0, tvoc_0
  if cur_val <= cur_max:
    return True
  return False

# Describe this function...
def update_max():
  global cur_val, cur_max, hour, tvoc_mesaurement, current_time, r_code, co2_measurement, g_code, max_tvoc, last_update, b_code, max_co2, min_tvoc, Background_color, min_co2, Text_color, num_of_mesurements, minute, second, co2_now, label_tvoc, co2_min, co2_max, tvoc_min, tvoc_max, Co2_title, TVOC_title, Last_update, update_time, i2c0, tvoc_0
  if max_co2 == None:
    max_tvoc = tvoc_mesaurement
    min_tvoc = tvoc_mesaurement
    max_co2 = co2_measurement
    min_co2 = co2_measurement
  else:
    if check_for_new_max(tvoc_mesaurement, max_tvoc):
      max_tvoc = tvoc_mesaurement
    if check_for_new_max(co2_measurement, max_co2):
      max_co2 = co2_measurement
    if check_for_new_min(tvoc_mesaurement, min_tvoc):
      min_tvoc = tvoc_mesaurement
    if check_for_new_min(co2_measurement, min_co2):
      min_co2 = co2_measurement

# Describe this function...
def Update_display():
  global cur_val, cur_max, hour, tvoc_mesaurement, current_time, r_code, co2_measurement, g_code, max_tvoc, last_update, b_code, max_co2, min_tvoc, Background_color, min_co2, Text_color, num_of_mesurements, minute, second, co2_now, label_tvoc, co2_min, co2_max, tvoc_min, tvoc_max, Co2_title, TVOC_title, Last_update, update_time, i2c0, tvoc_0
  co2_now.setText(str((str('now: ') + str(co2_measurement))))
  co2_min.setText(str((str('min: ') + str(min_co2))))
  co2_max.setText(str((str('max: ') + str(max_co2))))
  label_tvoc.setText(str((str('now: ') + str(tvoc_mesaurement))))
  tvoc_min.setText(str((str('min: ') + str(min_tvoc))))
  tvoc_max.setText(str((str('max: ') + str(max_tvoc))))
  num_mesurements.setText(str((str('# ') + str(num_of_mesurements))))
  hour = (time.localtime())[3]
  minute = (time.localtime())[4]
  second = (time.localtime())[5]
  update_time.setText(str((str(hour) + str(((str(':') + str(((str(minute) + str(((str(':') + str(second)))))))))))))


def btnA_wasClicked_event(state):
  global co2_now, label_tvoc, co2_min, co2_max, tvoc_min, tvoc_max, Co2_title, TVOC_title, Last_update, update_time, i2c0, tvoc_0, hour, tvoc_mesaurement, current_time, r_code, co2_measurement, g_code, max_tvoc, last_update, b_code, cur_val, cur_max, max_co2, min_tvoc, Background_color, min_co2, Text_color, num_of_mesurements, minute, second
  Change_color()


def setup():
  global co2_now, label_tvoc, co2_min, co2_max, tvoc_min, tvoc_max, Co2_title, TVOC_title, Last_update, update_time, i2c0, tvoc_0, hour, tvoc_mesaurement, current_time, r_code, co2_measurement, g_code, max_tvoc, last_update, b_code, cur_val, cur_max, max_co2, min_tvoc, Background_color, min_co2, Text_color, num_of_mesurements, minute, second

  M5.begin()
  co2_now = Widgets.Label("co2_now", 0, 19, 1.0, 0xffffff, 0x222222, Widgets.FONTS.DejaVu12)
  label_tvoc = Widgets.Label("tvoc", 0, 126, 1.0, 0xffffff, 0x222222, Widgets.FONTS.DejaVu12)
  co2_min = Widgets.Label("co2_min", 0, 34, 1.0, 0xffffff, 0x222222, Widgets.FONTS.DejaVu12)
  co2_max = Widgets.Label("co2_max", -1, 49, 1.0, 0xffffff, 0x222222, Widgets.FONTS.DejaVu12)
  tvoc_min = Widgets.Label("tvoc_min", 0, 139, 1.0, 0xffffff, 0x222222, Widgets.FONTS.DejaVu12)
  tvoc_max = Widgets.Label("tvoc_max", -1, 154, 1.0, 0xffffff, 0x222222, Widgets.FONTS.DejaVu12)
  Co2_title = Widgets.Label("Co2", 0, 0, 1.0, 0xffffff, 0x222222, Widgets.FONTS.DejaVu18)
  TVOC_title = Widgets.Label("TVOC", 0, 105, 1.0, 0xffffff, 0x222222, Widgets.FONTS.DejaVu18)
  Last_update = Widgets.Label("Last Update", 0, 180, 1.0, 0xffffff, 0x222222, Widgets.FONTS.DejaVu18)
  update_time = Widgets.Label("label0", 0, 206, 1.0, 0xffffff, 0x222222, Widgets.FONTS.DejaVu12)

  BtnA.setCallback(type=BtnA.CB_TYPE.WAS_CLICKED, cb=btnA_wasClicked_event)

  i2c0 = I2C(0, scl=Pin(33), sda=Pin(32), freq=100000)
  tvoc_0 = TVOCUnit(i2c0)
  time.timezone('GMT-2')
  last_update = time.ticks_ms()
  Measure()
  Change_color()


def loop():
  global co2_now, label_tvoc, co2_min, co2_max, tvoc_min, tvoc_max, Co2_title, TVOC_title, Last_update, update_time, i2c0, tvoc_0, hour, tvoc_mesaurement, current_time, r_code, co2_measurement, g_code, max_tvoc, last_update, b_code, cur_val, cur_max, max_co2, min_tvoc, Background_color, min_co2, Text_color, num_of_mesurements, minute, second
  M5.update()
  update_every_min()


if __name__ == '__main__':
  try:
    setup()
    while True:
      loop()
  except (Exception, KeyboardInterrupt) as e:
    try:
      from utility import print_error_msg
      print_error_msg(e)
    except ImportError:
      print("please update to latest firmware")
