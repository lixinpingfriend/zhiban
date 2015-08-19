select
    name file_name,
    content_type file_type,
    file_path
from 
	pm_document
where 
	tuid=${fld:tuid}
