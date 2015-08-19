select
  tuid,
  hand_id,
  to_char(hand_date,'yyyy-MM-dd HH24:mi:ss') hand_date,
  (select fname from s_user where user_id = hand_id) hand_name,
  to_char(carry_date,'yyyy-MM-dd HH24:mi:ss') carry_date,
  (select fname from s_user where user_id = carry_id) carry_name,
  remark
from 
  pm_duty_join
order by hand_date desc