import os
import glob
import time
import RPi.GPIO as GPIO
import datetime
import MySQLdb

os.system('modprobe w1-gpio')
os.system('modprobe w1-therm')

GPIO.setmode(GPIO.BOARD)
GPIO.setup(11, GPIO.OUT)
GPIO.setup(13, GPIO.OUT)
GPIO.output(13, False)
GPIO.output(11, False)
GPIO.setwarnings(False)


base_dir = '/sys/bus/w1/devices/'
device_folder = glob.glob(base_dir + '28*')[0]
device_file = device_folder + '/w1_slave'

db = MySQLdb.connect("localhost", "monitor", "monitor", "temp")
curs = db.cursor()

def read_temp_raw():
    f = open(device_file, 'r')
    lines = f.readlines()
    f.close()
    return lines

def read_temp():
    lines = read_temp_raw()
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = read_temp_raw()
    equals_pos = lines[1].find('t=')
    if equals_pos != -1:
        temp_string = lines[1][equals_pos + 2:]
        temp_c = float(temp_string) / 1000.0
        return temp_c

while True:
    temp = read_temp()
    print(str(datetime.datetime.now()) + ' ' + str(temp))

   
    curs.execute("INSERT INTO tempdata (date, time, temp) VALUES(CURRENT_DATE(), NOW(), " + str(temp) +")")
    db.commit()
    
   
    
    if float(temp) <= 20 or float(temp) >= 23:
        GPIO.output(11, False)
        GPIO.output(13, True)
    else:
        GPIO.output(13, False)
        GPIO.output(11, True)

    time.sleep(60)
GPIO.cleanup()
