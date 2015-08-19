select 
  tuid,
  to_char(hand_date,'yyyy-MM-dd HH24:mi:ss') hand_date,
  hand_id,
  (select fname from s_user where user_id = hand_id) hand_name,
  tool_condition,
  sanitation_condition,
  fire_condition
from 
  pm_duty_join
where tuid = ${fld:tuid}
  