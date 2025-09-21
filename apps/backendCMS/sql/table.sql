create table msh_goods
(
    id             varchar(64)      not null
        primary key,
    goods_name     varchar(100)     not null comment '商品名称',
    goods_bar_code varchar(100)     not null comment '商品条形码',
    goods_img      varchar(255)     null comment '商品图片',
    status         char default '0' not null comment '状态（0正常 1删除 2停用）',
    create_by      varchar(64)      not null comment '创建者',
    create_date    datetime         not null comment '创建时间',
    update_by      varchar(64)      null comment '更新者',
    update_date    datetime         not null comment '更新时间'
)
    comment '商品表';

create table msh_inventory
(
    id               varchar(64) not null comment 'id'
        primary key,
    goods_id         varchar(64) not null comment '商品id',
    inventory_number int         not null comment '库存数量',
    warehouse_id     varchar(64) not null comment '仓库id',
    create_by        varchar(64) not null comment '创建者',
    create_date      datetime    not null comment '创建时间',
    update_by        varchar(64) not null comment '更新者',
    update_date      datetime    not null comment '更新时间',
    constraint msh_inventory_msh_goods_id_fk
        foreign key (goods_id) references msh_goods (id)
)
    comment '库存表';

create table msh_user_group
(
    id varchar(64) not null comment 'id'
);

create table msh_warehouse
(
    id             varchar(64)      not null
        primary key,
    warehouse_name varchar(100)     not null comment '仓库名称',
    status         char default '0' not null comment '状态（0正常 1删除 2停用）',
    create_by      varchar(64)      not null comment '创建者',
    create_date    datetime         not null comment '创建时间',
    update_by      varchar(64)      not null comment '更新者',
    update_date    datetime         not null comment '更新时间'
)
    comment '仓库表';

create table sys_area
(
    area_code    varchar(100)     not null comment '区域编码'
        primary key,
    area_name    varchar(100)     not null comment '区域名称',
    parent_code  varchar(64)      not null comment '父级编号',
    parent_codes varchar(767)     not null comment '所有父级编号',
    tree_sort    decimal          not null comment '排序号（升序）',
    tree_sorts   varchar(767)     not null comment '所有排序号',
    tree_leaf    char             not null comment '是否最末级',
    tree_level   decimal(4)       not null comment '层次级别',
    tree_names   varchar(767)     not null comment '全节点名',
    area_type    char             null comment '区域类型',
    status       char default '0' not null comment '状态（0正常 1删除 2停用）',
    create_by    varchar(64)      not null comment '创建者',
    create_date  datetime         not null comment '创建时间',
    update_by    varchar(64)      not null comment '更新者',
    update_date  datetime         not null comment '更新时间',
    remarks      varchar(500)     null comment '备注信息'
)
    comment '行政区划';

create index idx_sys_area_pc
    on sys_area (parent_code);

create index idx_sys_area_pcs
    on sys_area (parent_codes);

create index idx_sys_area_status
    on sys_area (status);

create index idx_sys_area_ts
    on sys_area (tree_sort);

create index idx_sys_area_tss
    on sys_area (tree_sorts);

create table sys_company_office
(
    company_code varchar(64) not null comment '公司编码',
    office_code  varchar(64) not null comment '机构编码',
    primary key (company_code, office_code)
)
    comment '公司部门关联表';

create table sys_config
(
    id           varchar(64)   not null comment '编号'
        primary key,
    config_name  varchar(100)  not null comment '名称',
    config_key   varchar(100)  not null comment '参数键',
    config_value varchar(1000) null comment '参数值',
    is_sys       char          not null comment '系统内置（1是 0否）',
    create_by    varchar(64)   not null comment '创建者',
    create_date  datetime      not null comment '创建时间',
    update_by    varchar(64)   not null comment '更新者',
    update_date  datetime      not null comment '更新时间',
    remarks      varchar(500)  null comment '备注信息',
    constraint idx_sys_config_key
        unique (config_key)
)
    comment '参数配置表';

create table sys_corp
(
    id          varchar(64)                  not null comment '编号'
        primary key,
    corp_code   varchar(255) charset utf8mb4 not null comment '租户code',
    corp_name   varchar(255)                 not null comment '租户名称',
    status      char default '0'             not null comment '状态（0正常 1删除 2停用）',
    create_by   varchar(64)                  null comment '创建者',
    create_date datetime                     null comment '创建时间',
    update_by   varchar(64)                  null comment '更新者',
    update_date datetime                     null comment '更新时间',
    remarks     varchar(500)                 null comment '备注信息'
)
    comment '租户表' collate = utf8mb4_general_ci;

create index idx_sys_corp_cc
    on sys_corp (corp_code);

create table sys_dict_data
(
    id          varchar(64)              not null comment '字典编码'
        primary key,
    parent_code varchar(64)              not null comment '父级编号',
    dict_label  varchar(100)             not null comment '字典标签',
    dict_value  varchar(100)             not null comment '字典键值',
    sort        decimal                  not null comment '排序号（升序）',
    dict_icon   varchar(100)             null comment '字典图标',
    dict_type   varchar(100)             not null comment '字典类型',
    is_sys      char                     not null comment '系统内置（1是 0否）',
    css_style   varchar(500)             null comment 'css样式（如：color:red)',
    css_class   varchar(500)             null comment 'css类名（如：red）',
    status      char         default '0' not null comment '状态（0正常 1删除 2停用）',
    description varchar(500)             null comment '字典描述',
    remarks     varchar(500)             null comment '备注信息',
    corp_code   varchar(64)  default ''  not null comment '租户代码',
    corp_name   varchar(100) default ''  not null comment '租户名称',
    create_by   varchar(64)              not null comment '创建者',
    create_date datetime                 not null comment '创建时间',
    update_by   varchar(64)              not null comment '更新者',
    update_date datetime                 not null comment '更新时间'
)
    comment '字典数据表';

create index idx_sys_dict_data_cc
    on sys_dict_data (corp_code);

create index idx_sys_dict_data_dt
    on sys_dict_data (dict_type);

create index idx_sys_dict_data_dv
    on sys_dict_data (dict_value);

create index idx_sys_dict_data_pc
    on sys_dict_data (parent_code);

create index idx_sys_dict_data_sort
    on sys_dict_data (sort);

create index idx_sys_dict_data_status
    on sys_dict_data (status);

create table sys_dict_type
(
    id          varchar(64)      not null comment '编号'
        primary key,
    parent_id   varchar(64)      null comment '父级',
    dict_name   varchar(100)     not null comment '字典名称',
    dict_type   varchar(100)     not null comment '字典类型',
    is_sys      char             not null comment '是否系统字典',
    status      char default '0' not null comment '状态（0正常 1删除 2停用）',
    create_by   varchar(64)      not null comment '创建者',
    create_date datetime         not null comment '创建时间',
    update_by   varchar(64)      not null comment '更新者',
    update_date datetime         not null comment '更新时间',
    remarks     varchar(500)     null comment '备注信息'
)
    comment '字典类型表';

create index idx_sys_dict_type_is
    on sys_dict_type (is_sys);

create index idx_sys_dict_type_status
    on sys_dict_type (status);

create table sys_employee
(
    emp_code     varchar(64)             not null comment '员工编码'
        primary key,
    emp_name     varchar(100)            not null comment '员工姓名',
    emp_name_en  varchar(100)            null comment '员工英文名',
    emp_no       varchar(100)            null comment '员工工号',
    office_code  varchar(64)             not null comment '机构编码',
    office_name  varchar(100)            not null comment '机构名称',
    company_code varchar(64)             null comment '公司编码',
    company_name varchar(200)            null comment '公司名称',
    status       char                    not null comment '状态（0在职 1删除 2离职）',
    create_by    varchar(64)             not null comment '创建者',
    create_date  datetime                not null comment '创建时间',
    update_by    varchar(64)             not null comment '更新者',
    update_date  datetime                not null comment '更新时间',
    remarks      varchar(500)            null comment '备注信息',
    corp_code    varchar(64)  default '' not null comment '租户代码',
    corp_name    varchar(100) default '' not null comment '租户名称'
)
    comment '员工表';

create index idx_sys_employee_cc
    on sys_employee (corp_code);

create index idx_sys_employee_cco
    on sys_employee (company_code);

create index idx_sys_employee_oc
    on sys_employee (office_code);

create index idx_sys_employee_status
    on sys_employee (status);

create index idx_sys_employee_ud
    on sys_employee (update_date);

create table sys_employee_post
(
    emp_code  varchar(64) not null comment '员工编码',
    post_code varchar(64) not null comment '岗位编码',
    primary key (emp_code, post_code)
)
    comment '员工与岗位关联表';

create table sys_file_entity
(
    file_id           varchar(64)   not null comment '文件编号'
        primary key,
    file_md5          varchar(64)   not null comment '文件MD5',
    file_path         varchar(1000) not null comment '文件相对路径',
    file_content_type varchar(200)  not null comment '文件内容类型',
    file_extension    varchar(100)  not null comment '文件后缀扩展名',
    file_size         decimal(31)   not null comment '文件大小(单位B)',
    file_meta         varchar(255)  null comment '文件信息(JSON格式)',
    file_preview      char          null comment '文件预览标记'
)
    comment '文件实体表';

create index idx_sys_file_entity_md5
    on sys_file_entity (file_md5);

create index idx_sys_file_entity_size
    on sys_file_entity (file_size);

create table sys_file_folder
(
    id          varchar(64)  not null comment 'ID'
        primary key,
    folder_name varchar(64)  not null comment '文件夹名称',
    parent_id   varchar(64)  null comment '上级文件夹',
    status      char         not null comment '状态（0正常 1删除 2停用）',
    create_by   varchar(64)  not null comment '创建者',
    create_date datetime     not null comment '创建时间',
    update_by   varchar(64)  not null comment '更新者',
    update_date datetime     not null comment '更新时间',
    remarks     varchar(500) null comment '备注'
)
    comment '文件夹';

create table sys_file_upload
(
    file_id     varchar(64)      not null comment '编号'
        primary key,
    file_name   varchar(500)     not null comment '文件名称',
    file_type   varchar(20)      not null comment '文件分类（image、media、file）',
    file_path   varchar(500)     not null comment '文件路径',
    file_sort   decimal          null comment '文件排序（升序）',
    file_size   decimal          null comment '文件大小',
    folder_id   varchar(64)      not null comment '文件夹id',
    status      char default '0' not null comment '状态（0正常 1删除 2停用）',
    create_by   varchar(64)      not null comment '创建者',
    create_date datetime         not null comment '创建时间',
    update_by   varchar(64)      not null comment '更新者',
    update_date datetime         not null comment '更新时间',
    remarks     varchar(500)     null comment '备注信息'
)
    comment '文件上传表';

create index idx_sys_file_biz_bt
    on sys_file_upload (file_size);

create index idx_sys_file_biz_cb
    on sys_file_upload (create_by);

create index idx_sys_file_biz_ft
    on sys_file_upload (file_type);

create index idx_sys_file_biz_status
    on sys_file_upload (status);

create index idx_sys_file_biz_ud
    on sys_file_upload (update_date);

create table sys_files
(
    id          varchar(65)  not null comment 'ID'
        primary key,
    file_name   varchar(500) not null comment '文件名',
    file_type   char(0)      not null comment '文件类型（0文件夹，1图片，2视频）',
    status      char(0)      not null comment '状态',
    create_by   varchar(64)  not null comment '创建者',
    create_date datetime     not null comment '创建时间',
    update_by   varchar(64)  null comment '更新者',
    update_date datetime     null comment '更新时间',
    remarks     varchar(500) null comment '备注'
)
    comment '文件存储（本地）';

create table sys_lang
(
    id          varchar(64)  not null comment '编号'
        primary key,
    module_code varchar(64)  not null comment '归属模块',
    lang_code   varchar(500) not null comment '语言编码',
    lang_text   varchar(500) not null comment '语言译文',
    lang_type   varchar(50)  not null comment '语言类型',
    create_by   varchar(64)  not null comment '创建者',
    create_date datetime     not null comment '创建时间',
    update_by   varchar(64)  not null comment '更新者',
    update_date datetime     not null comment '更新时间',
    remarks     varchar(500) null comment '备注信息'
)
    comment '国际化语言';

create index idx_sys_lang_code
    on sys_lang (lang_code);

create index idx_sys_lang_type
    on sys_lang (lang_type);

create table sys_log
(
    id               varchar(64)             not null comment '编号'
        primary key,
    log_type         varchar(50)             not null comment '日志类型',
    log_title        varchar(500)            not null comment '日志标题',
    create_by        varchar(64)             not null comment '创建者',
    create_by_name   varchar(100)            not null comment '用户名称',
    create_date      datetime                not null comment '创建时间',
    request_uri      varchar(500)            null comment '请求URI',
    request_method   varchar(10)             null comment '操作方式',
    request_params   longtext                null comment '操作提交的数据',
    diff_modify_data text                    null comment '新旧数据比较结果',
    biz_key          varchar(64)             null comment '业务主键',
    biz_type         varchar(64)             null comment '业务类型',
    remote_addr      varchar(255)            not null comment '操作IP地址',
    server_addr      varchar(255)            not null comment '请求服务器地址',
    is_exception     char                    null comment '是否异常',
    exception_info   text                    null comment '异常信息',
    user_agent       varchar(500)            null comment '用户代理',
    device_name      varchar(100)            null comment '设备名称/操作系统',
    browser_name     varchar(100)            null comment '浏览器名称',
    execute_time     decimal(19)             null comment '执行时间',
    corp_code        varchar(64)  default '' not null comment '租户代码',
    corp_name        varchar(100) default '' not null comment '租户名称'
)
    comment '操作日志表';

create index idx_sys_log_bk
    on sys_log (biz_key);

create index idx_sys_log_bt
    on sys_log (biz_type);

create index idx_sys_log_cb
    on sys_log (create_by);

create index idx_sys_log_cc
    on sys_log (corp_code);

create index idx_sys_log_cd
    on sys_log (create_date);

create index idx_sys_log_ie
    on sys_log (is_exception);

create index idx_sys_log_lt
    on sys_log (log_type);

create table sys_menu
(
    id           varchar(64)      not null
        primary key,
    menu_code    varchar(64)      not null comment '菜单编码',
    menu_name    varchar(100)     not null comment '菜单名称',
    parent_code  varchar(64)      not null comment '父级编号',
    parent_codes varchar(767)     not null comment '所有父级编号',
    tree_sort    decimal          not null comment '排序号（升序）',
    tree_sorts   varchar(767)     not null comment '所有排序号',
    tree_leaf    char             not null comment '是否最末级',
    tree_level   decimal(4)       not null comment '层次级别',
    tree_names   varchar(767)     not null comment '全节点名',
    menu_type    char             not null comment '菜单类型（1菜单 2模块 3按钮）',
    menu_href    varchar(1000)    null comment '链接',
    menu_target  varchar(20)      null comment '目标',
    menu_icon    varchar(100)     null comment '图标',
    menu_color   varchar(50)      null comment '颜色',
    menu_title   varchar(100)     null comment '菜单标题',
    permission   varchar(1000)    null comment '权限标识',
    is_show      char             not null comment '是否显示（1显示 0隐藏）',
    sys_code     varchar(64)      not null comment '归属系统（manage:管理平台、app:APP菜单）',
    module_codes varchar(500)     not null comment '归属模块（多个用逗号隔开）',
    component    varchar(500)     null comment '组件路径',
    params       varchar(500)     null comment '组件参数',
    status       char default '0' not null comment '状态（0正常 1删除 2停用）',
    create_by    varchar(64)      not null comment '创建者',
    create_date  datetime         not null comment '创建时间',
    update_by    varchar(64)      not null comment '更新者',
    update_date  datetime         not null comment '更新时间',
    remarks      varchar(500)     null comment '备注信息'
)
    comment '菜单表';

create index idx_sys_menu_id
    on sys_menu (id);

create index idx_sys_menu_is
    on sys_menu (is_show);

create index idx_sys_menu_mcs
    on sys_menu (module_codes);

create index idx_sys_menu_mt
    on sys_menu (menu_type);

create index idx_sys_menu_pc
    on sys_menu (parent_code);

create index idx_sys_menu_pss
    on sys_menu (parent_codes);

create index idx_sys_menu_sc
    on sys_menu (sys_code);

create index idx_sys_menu_status
    on sys_menu (status);

create index idx_sys_menu_ts
    on sys_menu (tree_sort);

create index idx_sys_menu_tss
    on sys_menu (tree_sorts);

create table sys_msg_inner
(
    id             varchar(64)  not null comment '编号'
        primary key,
    msg_title      varchar(200) not null comment '消息标题',
    content_level  char         not null comment '内容级别（1普通 2一般 3紧急）',
    content_type   char         null comment '内容类型（1公告 2新闻 3会议 4其它）',
    msg_content    text         not null comment '消息内容',
    receive_type   char         not null comment '接受者类型（0全部 1用户 2部门 3角色 4岗位）',
    receive_codes  text         null comment '接受者字符串',
    receive_names  text         null comment '接受者名称字符串',
    send_user_code varchar(64)  null comment '发送者用户编码',
    send_user_name varchar(100) null comment '发送者用户姓名',
    send_date      datetime     null comment '发送时间',
    is_attac       char         null comment '是否有附件',
    notify_types   varchar(100) null comment '通知类型（PC APP 短信 邮件 微信）多选',
    status         char         not null comment '状态（0正常 1删除 4审核 5驳回 9草稿）',
    create_by      varchar(64)  not null comment '创建者',
    create_date    datetime     not null comment '创建时间',
    update_by      varchar(64)  not null comment '更新者',
    update_date    datetime     not null comment '更新时间',
    remarks        varchar(500) null comment '备注信息'
)
    comment '内部消息';

create index idx_sys_msg_inner_cb
    on sys_msg_inner (create_by);

create index idx_sys_msg_inner_cl
    on sys_msg_inner (content_level);

create index idx_sys_msg_inner_sc
    on sys_msg_inner (send_user_code);

create index idx_sys_msg_inner_sd
    on sys_msg_inner (send_date);

create index idx_sys_msg_inner_status
    on sys_msg_inner (status);

create table sys_msg_inner_record
(
    id                varchar(64)  not null comment '编号'
        primary key,
    msg_inner_id      varchar(64)  not null comment '所属消息',
    receive_user_code varchar(64)  not null comment '接受者用户编码',
    receive_user_name varchar(100) not null comment '接受者用户姓名',
    read_status       char         not null comment '读取状态（0未送达 1已读 2未读）',
    read_date         datetime     null comment '阅读时间',
    is_star           char         null comment '是否标星'
)
    comment '内部消息发送记录表';

create index idx_sys_msg_inner_r_mi
    on sys_msg_inner_record (msg_inner_id);

create index idx_sys_msg_inner_r_ruc
    on sys_msg_inner_record (receive_user_code);

create index idx_sys_msg_inner_r_star
    on sys_msg_inner_record (is_star);

create index idx_sys_msg_inner_r_stat
    on sys_msg_inner_record (read_status);

create table sys_msg_push
(
    id                  varchar(64)  not null comment '编号'
        primary key,
    msg_type            varchar(16)  not null comment '消息类型（PC APP 短信 邮件 微信）',
    msg_title           varchar(200) not null comment '消息标题',
    msg_content         text         not null comment '消息内容',
    biz_key             varchar(64)  null comment '业务主键',
    biz_type            varchar(64)  null comment '业务类型',
    receive_code        varchar(64)  not null comment '接受者账号',
    receive_user_code   varchar(64)  not null comment '接受者用户编码',
    receive_user_name   varchar(100) not null comment '接受者用户姓名',
    send_user_code      varchar(64)  not null comment '发送者用户编码',
    send_user_name      varchar(100) not null comment '发送者用户姓名',
    send_date           datetime     not null comment '发送时间',
    is_merge_push       char         null comment '是否合并推送',
    plan_push_date      datetime     null comment '计划推送时间',
    push_number         int          null comment '推送尝试次数',
    push_return_code    varchar(200) null comment '推送返回结果码',
    push_return_msg_id  varchar(200) null comment '推送返回消息编号',
    push_return_content text         null comment '推送返回的内容信息',
    push_status         char         null comment '推送状态（0未推送 1成功  2失败）',
    push_date           datetime     null comment '推送时间',
    read_status         char         null comment '读取状态（0未送达 1已读 2未读）',
    read_date           datetime     null comment '读取时间'
)
    comment '消息推送表';

create index idx_sys_msg_push_bk
    on sys_msg_push (biz_key);

create index idx_sys_msg_push_bt
    on sys_msg_push (biz_type);

create index idx_sys_msg_push_imp
    on sys_msg_push (is_merge_push);

create index idx_sys_msg_push_pd
    on sys_msg_push (plan_push_date);

create index idx_sys_msg_push_ps
    on sys_msg_push (push_status);

create index idx_sys_msg_push_rc
    on sys_msg_push (receive_code);

create index idx_sys_msg_push_rs
    on sys_msg_push (read_status);

create index idx_sys_msg_push_suc
    on sys_msg_push (send_user_code);

create index idx_sys_msg_push_type
    on sys_msg_push (msg_type);

create index idx_sys_msg_push_uc
    on sys_msg_push (receive_user_code);

create table sys_msg_pushed
(
    id                  varchar(64)  not null comment '编号'
        primary key,
    msg_type            varchar(16)  not null comment '消息类型（PC APP 短信 邮件 微信）',
    msg_title           varchar(200) not null comment '消息标题',
    msg_content         text         not null comment '消息内容',
    biz_key             varchar(64)  null comment '业务主键',
    biz_type            varchar(64)  null comment '业务类型',
    receive_code        varchar(64)  not null comment '接受者账号',
    receive_user_code   varchar(64)  not null comment '接受者用户编码',
    receive_user_name   varchar(100) not null comment '接受者用户姓名',
    send_user_code      varchar(64)  not null comment '发送者用户编码',
    send_user_name      varchar(100) not null comment '发送者用户姓名',
    send_date           datetime     not null comment '发送时间',
    is_merge_push       char         null comment '是否合并推送',
    plan_push_date      datetime     null comment '计划推送时间',
    push_number         int          null comment '推送尝试次数',
    push_return_content text         null comment '推送返回的内容信息',
    push_return_code    varchar(200) null comment '推送返回结果码',
    push_return_msg_id  varchar(200) null comment '推送返回消息编号',
    push_status         char         null comment '推送状态（0未推送 1成功  2失败）',
    push_date           datetime     null comment '推送时间',
    read_status         char         null comment '读取状态（0未送达 1已读 2未读）',
    read_date           datetime     null comment '读取时间'
)
    comment '消息已推送表';

create index idx_sys_msg_pushed_bk
    on sys_msg_pushed (biz_key);

create index idx_sys_msg_pushed_bt
    on sys_msg_pushed (biz_type);

create index idx_sys_msg_pushed_imp
    on sys_msg_pushed (is_merge_push);

create index idx_sys_msg_pushed_pd
    on sys_msg_pushed (plan_push_date);

create index idx_sys_msg_pushed_ps
    on sys_msg_pushed (push_status);

create index idx_sys_msg_pushed_rc
    on sys_msg_pushed (receive_code);

create index idx_sys_msg_pushed_rs
    on sys_msg_pushed (read_status);

create index idx_sys_msg_pushed_suc
    on sys_msg_pushed (send_user_code);

create index idx_sys_msg_pushed_type
    on sys_msg_pushed (msg_type);

create index idx_sys_msg_pushed_uc
    on sys_msg_pushed (receive_user_code);

create table sys_msg_template
(
    id          varchar(64)      not null comment '编号'
        primary key,
    module_code varchar(64)      null comment '归属模块',
    tpl_key     varchar(100)     not null comment '模板键值',
    tpl_name    varchar(100)     not null comment '模板名称',
    tpl_type    varchar(16)      not null comment '模板类型',
    tpl_content text             not null comment '模板内容',
    status      char default '0' not null comment '状态（0正常 1删除 2停用）',
    create_by   varchar(64)      not null comment '创建者',
    create_date datetime         not null comment '创建时间',
    update_by   varchar(64)      not null comment '更新者',
    update_date datetime         not null comment '更新时间',
    remarks     varchar(500)     null comment '备注信息'
)
    comment '消息模板';

create index idx_sys_msg_tpl_key
    on sys_msg_template (tpl_key);

create index idx_sys_msg_tpl_status
    on sys_msg_template (status);

create index idx_sys_msg_tpl_type
    on sys_msg_template (tpl_type);

create table sys_office
(
    office_code  varchar(64)              not null comment '机构编码'
        primary key,
    view_code    varchar(100)             not null comment '机构代码',
    office_name  varchar(100)             not null comment '机构名称',
    full_name    varchar(200)             not null comment '机构全称',
    parent_code  varchar(64)              not null comment '父级编号',
    parent_codes varchar(767)             not null comment '所有父级编号',
    tree_sort    decimal                  not null comment '排序号（升序）',
    tree_sorts   varchar(767)             not null comment '所有排序号',
    tree_leaf    char                     not null comment '是否最末级',
    tree_level   decimal(4)               not null comment '层次级别',
    tree_names   varchar(767)             not null comment '全节点名',
    office_type  char                     not null comment '机构类型',
    leader       varchar(100)             null comment '负责人',
    phone        varchar(100)             null comment '办公电话',
    address      varchar(255)             null comment '联系地址',
    zip_code     varchar(100)             null comment '邮政编码',
    email        varchar(300)             null comment '电子邮箱',
    status       char         default '0' not null comment '状态（0正常 1删除 2停用）',
    create_by    varchar(64)              not null comment '创建者',
    create_date  datetime                 not null comment '创建时间',
    update_by    varchar(64)              not null comment '更新者',
    update_date  datetime                 not null comment '更新时间',
    remarks      varchar(500)             null comment '备注信息',
    corp_code    varchar(64)  default ''  not null comment '租户代码',
    corp_name    varchar(100) default ''  not null comment '租户名称'
)
    comment '组织机构表';

create index idx_sys_office_cc
    on sys_office (corp_code);

create index idx_sys_office_ot
    on sys_office (office_type);

create index idx_sys_office_pc
    on sys_office (parent_code);

create index idx_sys_office_pcs
    on sys_office (parent_codes);

create index idx_sys_office_status
    on sys_office (status);

create index idx_sys_office_ts
    on sys_office (tree_sort);

create index idx_sys_office_tss
    on sys_office (tree_sorts);

create index idx_sys_office_vc
    on sys_office (view_code);

create table sys_post
(
    post_code   varchar(64)              not null comment '岗位编码'
        primary key,
    view_code   varchar(100)             null comment '岗位代码',
    post_name   varchar(100)             not null comment '岗位名称',
    post_type   varchar(100)             null comment '岗位分类（高管、中层、基层）',
    post_sort   decimal                  null comment '岗位排序（升序）',
    status      char         default '0' not null comment '状态（0正常 1删除 2停用）',
    create_by   varchar(64)              not null comment '创建者',
    create_date datetime                 not null comment '创建时间',
    update_by   varchar(64)              not null comment '更新者',
    update_date datetime                 not null comment '更新时间',
    remarks     varchar(500)             null comment '备注信息',
    corp_code   varchar(64)  default ''  not null comment '租户代码',
    corp_name   varchar(100) default ''  not null comment '租户名称'
)
    comment '员工岗位表';

create index idx_sys_post_cc
    on sys_post (corp_code);

create index idx_sys_post_ps
    on sys_post (post_sort);

create index idx_sys_post_status
    on sys_post (status);

create table sys_post_role
(
    post_code varchar(64) not null comment '岗位编码',
    role_code varchar(64) not null comment '角色编码',
    primary key (post_code, role_code)
)
    comment '岗位与角色关联表';

create table sys_role
(
    id          varchar(64)              not null comment 'ID'
        primary key,
    role_code   varchar(64)              not null comment '角色编码',
    role_name   varchar(100)             not null comment '角色名称',
    role_sort   decimal                  null comment '角色排序（升序）',
    is_sys      char                     null comment '系统内置（1是 0否）',
    user_type   varchar(16)              null comment '用户类型（employee员工 member会员）',
    desktop_url varchar(255)             null comment '桌面地址（仪表盘地址）',
    status      char         default '0' not null comment '状态（0正常 1删除 2停用）',
    create_by   varchar(64)              not null comment '创建者',
    create_date datetime                 not null comment '创建时间',
    update_by   varchar(64)              not null comment '更新者',
    update_date datetime                 not null comment '更新时间',
    remarks     varchar(500)             null comment '备注信息',
    corp_code   varchar(64)  default ''  not null comment '租户代码',
    corp_name   varchar(100) default ''  not null comment '租户名称'
)
    comment '角色表';

create index idx_sys_role_cc
    on sys_role (corp_code);

create index idx_sys_role_id
    on sys_role (id);

create index idx_sys_role_is
    on sys_role (is_sys);

create index idx_sys_role_rs
    on sys_role (role_sort);

create index idx_sys_role_status
    on sys_role (status);

create table sys_role_data_scope
(
    role_code  varchar(64) not null comment '控制角色编码',
    ctrl_type  varchar(20) not null comment '控制类型',
    ctrl_data  varchar(64) not null comment '控制数据',
    ctrl_permi varchar(64) not null comment '控制权限',
    primary key (role_code, ctrl_type, ctrl_data, ctrl_permi)
)
    comment '角色数据权限表';

create table sys_role_menu
(
    role_code varchar(64) not null comment '角色编码',
    menu_code varchar(64) not null comment '菜单编码',
    primary key (role_code, menu_code)
)
    comment '角色与菜单关联表';

create table sys_user
(
    id                    varchar(64)             not null comment 'ID'
        primary key,
    user_code             varchar(100)            not null comment '用户编码',
    login_code            varchar(100)            not null comment '登录账号',
    user_name             varchar(100)            not null comment '用户昵称',
    password              varchar(200)            not null comment '登录密码',
    email                 varchar(300)            null comment '电子邮箱',
    mobile                varchar(100)            null comment '手机号码',
    phone                 varchar(100)            null comment '办公电话',
    sex                   char                    null comment '用户性别（0女性 1男性）',
    avatar                varchar(1000)           null comment '头像路径',
    sign                  varchar(200)            null comment '个性签名',
    wx_openid             varchar(100)            null comment '绑定的微信号',
    user_type             varchar(16)             not null comment '用户类型',
    ref_code              varchar(64)             null comment '用户类型引用编号',
    ref_name              varchar(100)            null comment '用户类型引用姓名',
    mgr_type              char                    not null comment '管理员类型（0非管理员 1系统管理员  2二级管理员）',
    pwd_security_level    decimal(1)              null comment '密码安全级别（0初始 1很弱 2弱 3安全 4很安全）',
    pwd_update_date       datetime                null comment '密码最后更新时间',
    pwd_update_record     varchar(1000)           null comment '密码修改记录',
    pwd_question          varchar(200)            null comment '密保问题',
    pwd_question_answer   varchar(200)            null comment '密保问题答案',
    pwd_question_2        varchar(200)            null comment '密保问题2',
    pwd_question_answer_2 varchar(200)            null comment '密保问题答案2',
    pwd_question_3        varchar(200)            null comment '密保问题3',
    pwd_question_answer_3 varchar(200)            null comment '密保问题答案3',
    pwd_quest_update_date datetime                null comment '密码问题修改时间',
    last_login_ip         varchar(100)            null comment '最后登陆IP',
    last_login_date       datetime                null comment '最后登陆时间',
    freeze_date           datetime                null comment '冻结时间',
    freeze_cause          varchar(200)            null comment '冻结原因',
    user_weight           decimal(8)   default 0  null comment '用户权重（降序）',
    warehouse_id          varchar(64)             null comment '默认仓库',
    status                char                    not null comment '状态（0正常 1删除 2停用 3冻结）',
    create_by             varchar(64)             not null comment '创建者',
    create_date           datetime                not null comment '创建时间',
    update_by             varchar(64)             not null comment '更新者',
    update_date           datetime                not null comment '更新时间',
    remarks               varchar(500)            null comment '备注信息',
    corp_code             varchar(64)  default '' null comment '租户代码',
    corp_name             varchar(100) default '' not null comment '租户名称'
)
    comment '用户表';

create index idx_sys_user_cc
    on sys_user (corp_code);

create index idx_sys_user_email
    on sys_user (email);

create index idx_sys_user_lc
    on sys_user (login_code);

create index idx_sys_user_mobile
    on sys_user (mobile);

create index idx_sys_user_mt
    on sys_user (mgr_type);

create index idx_sys_user_rc
    on sys_user (ref_code);

create index idx_sys_user_rt
    on sys_user (user_type);

create index idx_sys_user_status
    on sys_user (status);

create index idx_sys_user_ud
    on sys_user (update_date);

create index idx_sys_user_us
    on sys_user (user_weight);

create index idx_sys_user_wo
    on sys_user (wx_openid);

create table sys_user_data_scope
(
    user_code  varchar(100) not null comment '控制用户编码',
    ctrl_type  varchar(20)  not null comment '控制类型',
    ctrl_data  varchar(64)  not null comment '控制数据',
    ctrl_permi varchar(64)  not null comment '控制权限',
    primary key (user_code, ctrl_type, ctrl_data, ctrl_permi)
)
    comment '用户数据权限表';

create table sys_user_role
(
    user_code varchar(100) not null comment '用户编码',
    role_code varchar(64)  not null comment '角色编码',
    primary key (user_code, role_code)
)
    comment '用户与角色关联表';

