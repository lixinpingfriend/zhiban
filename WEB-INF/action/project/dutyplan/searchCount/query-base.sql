select count(1) num from pm_duty t where  to_char(t.plan_date,'yyyy-MM-dd')='${def:date}'