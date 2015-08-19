update  pm_person_qualifications  set begin_date=to_date(${fld:begin_date},'yyyy-MM-dd'),end_date=to_date(${fld:end_date},'yyyy-MM-dd')
where tuid=${fld:tuid}