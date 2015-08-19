select distinct device_id,to_char(created,'yyyy-MM-dd') created,check_status,t_order from pm_device_fix_repair
where date_type=${fld:date_type} and created  between to_timestamp(${fld:begin_date},'yyyy-MM-dd HH24:mi:ss') and 
to_timestamp(${fld:end_date},'yyyy-MM-dd HH24:mi:ss')
order by t_order desc