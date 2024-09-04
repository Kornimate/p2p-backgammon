import os, sys, io
import M5
from M5 import *
from hardware import *
from unit import TVOCUnit
import time



label_co2 = None
label_tvoc = None
num_mesurements = None
i2c0 = None
tvoc_0 = None


import random

tvoc_mesaurement = None
current_time = None
r_code = None
co2_measurement = None
g_code = None
num_of_mesurements = None
last_update = None
b_code = None

# Describe this function...
def Measure_and_update():
  global tvoc_mesaurement, current_time, r_code, co2_measurement, g_code, num_of_mesurements, last_update, b_code, label_co2, label_tvoc, num_mesurements, i2c0, tvoc_0
  tvoc_mesaurement = tvoc_0.tvoc()
  co2_measurement = tvoc_0.co2eq()
  num_of_mesurements = (num_of_mesurements if isinstance(num_of_mesurements, (int, float)) else 0) + 1
  label_tvoc.setText(str((str('tvoc: ') + str(tvoc_mesaurement))))
  label_co2.setText(str((str('Co2: ') + str(co2_measurement))))
  num_mesurements.setText(str((str('# ') + str(num_of_mesurements))))

# Describe this function...
def update_every_min():
  global tvoc_mesaurement, current_time, r_code, co2_measurement, g_code, num_of_mesurements, last_update, b_code, label_co2, label_tvoc, num_mesurements, i2c0, tvoc_0
  current_time = time.ticks_ms()
  if current_time >= last_update + 5000:
    last_update = current_time
    Measure_and_update()

# Describe this function...
def Change_color():
  global tvoc_mesaurement, current_time, r_code, co2_measurement, g_code, num_of_mesurements, last_update, b_code, label_co2, label_tvoc, num_mesurements, i2c0, tvoc_0
  r_code = random.randint(100, 255)
  g_code = random.randint(100, 255)
  b_code = random.randint(100, 255)
  Widgets.fillScreen((r_code << 16) | (g_code << 8) | b_code)
  label_co2.setColor(0x000000, (r_code << 16) | (g_code << 8) | b_code)
  label_tvoc.setColor(0x000000, (r_code << 16) | (g_code << 8) | b_code)
  num_mesurements.setColor(0x000000, (r_code << 16) | (g_code << 8) | b_code)


def btnA_wasClicked_event(state):
  global label_co2, label_tvoc, num_mesurements, i2c0, tvoc_0, tvoc_mesaurement, current_time, r_code, co2_measurement, g_code, num_of_mesurements, last_update, b_code
  Change_color()


def setup():
  global label_co2, label_tvoc, num_mesurements, i2c0, tvoc_0, tvoc_mesaurement, current_time, r_code, co2_measurement, g_code, num_of_mesurements, last_update, b_code

  M5.begin()
  label_co2 = Widgets.Label("label0", 1, 2, 1.0, 0xffffff, 0x222222, Widgets.FONTS.DejaVu18)
  label_tvoc = Widgets.Label("label1", 1, 28, 1.0, 0xffffff, 0x222222, Widgets.FONTS.DejaVu18)
  num_mesurements = Widgets.Label("label0", 4, 70, 1.0, 0xffffff, 0x222222, Widgets.FONTS.DejaVu18)

  BtnA.setCallback(type=BtnA.CB_TYPE.WAS_CLICKED, cb=btnA_wasClicked_event)

  i2c0 = I2C(0, scl=Pin(33), sda=Pin(32), freq=100000)
  tvoc_0 = TVOCUnit(i2c0)
  last_update = time.ticks_ms()
  num_of_mesurements = 0
  Change_color()
  Measure_and_update()


def loop():
  global label_co2, label_tvoc, num_mesurements, i2c0, tvoc_0, tvoc_mesaurement, current_time, r_code, co2_measurement, g_code, num_of_mesurements, last_update, b_code
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
