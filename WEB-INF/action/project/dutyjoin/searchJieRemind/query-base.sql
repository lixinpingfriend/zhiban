select count(1) num from pm_duty_join t
where carry_id=${ses:userId} and (carry_date is null or carry_date='')

