# app/core/constants.py

FORTIGATE_BASE = """# 
config system global
    set admin-sport 443
    set timezone 26
    set gui-display-hostname enable
end
config system dns
    set primary 8.8.8.8
    set secondary 8.8.4.4
end
# 
"""

CISCO_BASE = """
service timestamps debug datetime msec
service timestamps log datetime msec
no ip domain lookup
ip ssh version 2
!
line vty 0 4
 transport input ssh
 login local
!

"""

CISCO_FOOTER = "!\nline vty 0 4\n transport input ssh\n!\n!"
FORTI_FOOTER = "config system ntp\n    set ntpsync enable\nend"