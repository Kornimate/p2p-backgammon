import os, sys, io, time
import M5
from M5 import *
from hardware import *
from unit import TVOCUnit



label0 = None
label1 = None
i2c0 = None
tvoc_0 = None


co2_level = None
tvoc_level = None


def setup():
  global label0, label1, i2c0, tvoc_0, co2_level, tvoc_level

  M5.begin()
  label0 = Widgets.Label("label0", 2, 4, 1.0, 0xffffff, 0xd91616, Widgets.FONTS.DejaVu18)
  label1 = Widgets.Label("label1", 2, 30, 1.0, 0xffffff, 0xd91616, Widgets.FONTS.DejaVu18)

  i2c0 = I2C(0, scl=Pin(33), sda=Pin(32), freq=100000)


def measure_levels():
  tvoc_0 = TVOCUnit(i2c0)
  co2_level = tvoc_0.co2eq()
  tvoc_level = tvoc_0.tvoc()
  return co2_level, tvoc_level


def update_display(co2, tvoc):
    label0.setText("Co2: " + str(co2))
    label1.setText("TVOC: " + str(tvoc))

def measure_every_min():
  while True:
    co2, tvoc = measure_levels()
    update_display(co2,tvoc)
    print("hej")
    time.sleep(10)

def loop():
  global label0, i2c0, tvoc_0, co2_level, tvoc_level
  pass


if __name__ == '__main__':
  try:
    setup()
    measure_every_min()
  except (Exception, KeyboardInterrupt) as e:
    try:
      from utility import print_error_msg
      print_error_msg(e)
    except ImportError:
      print("please update to latest firmware")
