select
    name file_name,
    content_type file_type,
    file_path
from 
	pm_device_attchment
where 
	tuid=${fld:tuid}
