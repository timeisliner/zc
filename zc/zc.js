惯例


{v.0.1 2018-5-9 13:12:49
在同一个库、域、结构中，方法、变量、常量、参数等不能一样

命名              方式
public全局常量    全部改用 普通常量
普通全局常量      库名 + 下划线 + 首字母大写的常量名 libraryName_variableName
private全局常量   常量名全部大写 + 下划线  SPEED  or  INVALID or TIMER_RECYCLE_LIMIT
private全局变量   首字母大写   Timers  or Dialogs or TimerVernierCache
operator          使用英语单词
参数              字母a+类型首字母+operator名
成员              类型首字母+operator名
local             类型首字母+p+自定义名


库命名
  zcl + 首字母大写      zclPoint  or  zclDebug

结构命名
命名
{
结构
  zcNameds >> zc + 首字母大写[Named] + s
  public | private
    不能以zc开头，其余按惯例


}


冲突名
{create
destroy
init
isOn
isOff
off
on
onDestroy
Ready
run
runnable
tt >> ttps 专指用于 struct 中create方法
  local thistype ttps = thistype.allocate()
}



Enable Disable ED  - 范例
Define Set Get DSG - 范例
IS[STATUS]     IS  - 范例
{
METHOD >> isOn isOff on off     run runnable
ARG    >> aon aoff              在METHOD前加上一个字母 a
TYPE   >>                       类型专用
VALUE  >>                       [integer real 0] [boolean false] [string handle code null]
Member >> onf                   简写首字母 或者 第一二个字母 或者 首字母加上两个METHOD中包含的字母
FLAG   >> true false
API    >> native
EXP    >> expression
//! textmacro TM_结构名_ED takes METHOD, IS, VALUE
  method $METHOD$ takes nothing returns nothing
    if $IS$ then
      set this.onf = $VALUE$
    endif
  endmethod
//! endtextmacro

//! runtextmacro TM_结构名_ED("on", "not this.onf", "true")
//! runtextmacro TM_结构名_ED("off", "this.onf", "false")

//! textmacro TM_结构名_DSG takes METHOD, TYPE, VALUE, MEMBER
  private $TYPE$ $MEMBER$ = $VALUE$             
  method operator $METHOD$ takes nothing returns $TYPE$
    return this.$MEMBER$
  endmethod
  method operator $METHOD$= takes $TYPE$ a$MEMBER$ returns nothing
    set this.$MEMBER$ = a$MEMBER$
  endmethod
//! endtextmacro
//! runtextmacro TM_结构名_DSG("alpha", "integer", "255", "ialpha")
//! runtextmacro TM_结构名_DSG("red", "integer", "0", "ired")
//! runtextmacro TM_结构名_DSG("green", "integer", "0", "igreen")
//! runtextmacro TM_结构名_DSG("blue", "integer", "0", "iblue")


//! textmacro TM_结构名_IS takes METHOD, EXP
  method $METHOD$ takes nothing returns boolean
    return $EXP$
  endmethod 
//! endtextmacro

//! runtextmacro TM_结构名_IS("isOn", "IsTriggerEnabled(this.t)")
//! runtextmacro TM_结构名_IS("isOff", "not IsTriggerEnabled(this.t)")
//! runtextmacro TM_结构名_IS("isReset", "this.s == RESET")
//! runtextmacro TM_结构名_IS("isSleep", "IsTriggerWaitOnSleeps(this.t)")
//! runtextmacro TM_结构名_IS("isWaken", "not IsTriggerWaitOnSleeps(this.t)")
}

初始化
{
标记
初始化函数 - initializer 
  // 初始化函数
  // 默认 false 否-未初始化 一般用于library
  
globals
  private boolean Ready = false
endglobals
private function init takes nothing returns nothing
  // prevent reinit
  if Ready then
    return
  endif
  
  
  set Ready = true
endfunction
}

构造 解析
{
  static method create takes integer aired, integer aigreen, integer aiblue returns thistype
    local thistype ttps = thistype.allocate()
    if ttps == 0 then
      return 0
    endif
    
    set ttps.red = aired
    set ttps.green = aigreen
    set ttps.blue = aiblue
    
    return ttps
  endmethod
  
  method destroy takes nothing returns nothing
    if this != 0 then
      // 在手动解析之后 调用系统解析 回收编号
      call this.deallocate()
    endif
    debug call zcDebugs.output("结构名 ... destroyed!")
  endmethod
  
{
constructor
  // 构造函数
  static method create takes zcPoints apt returns thistype
    local thistype ttps = thistype.allocate()

destructor
  // 解析函数
  method destroy takes nothing returns nothing
    // 在手动解析之后 调用系统解析
    call this.deallocate()
  // 在实例调用destroy()时自动call该函数
  private method onDestroy takes nothing returns nothing 
}
}






如果 任务运行总数等于 0  tsrc < 1 then
  真
    设置 任务运行游标为 -1 set tsrv = -1
  假
    设置 临时任务 ttp = tsrv
    如果 临时任务变量的任务状态是开启的 ttp.isOn
      真
        设置 任务时
        检索 任务运行列表中的所有任务
  
  
  
  

tsw 总数 tswc <= 0 >>  tswc < 1 验证等待执行的任务总数是否为零
  {真
    设置 游标 tswv = -1
    中止 任务开启
  }
tsw 游标 tswv == -2 是否需要检索开启时间最近的待开启任务
  {真
    重置游标 tswv = 0
    重置循环次数变量为零 n = 0
    循环
      条件 n != 游标 and n指向任务开启时间 < 游标指向任务开启时间
        真
          设置游标 = n
        假
          设置循环次数变量加一次 n = n + 1
      循环退出验证
        循环次数变量 n >= 等待开启的任务总数 tswc
  }
tsw 任务开启验证 总数 游标任务 tswv 是否可以执行
  需要 游戏时间 GameTime 单位组 g
  {真
    设置 临时任务变量 ttp = 游标任务 tsw[tswv]
    设置 游标任务属于最后一次执行的时间 set ttp.time = 游戏时间 GameTime
    开启 游标任务 call ttp.on()
    发送 游标任务消息 call out.show(ttp.message + ttp.info())
    执行 游标任务 call ttp.onWork(g)
    
    将 等待任务总数减少一 set tswc = tswc - 1
    如果 等待任务游标 和 等待任务总数相等 if tswv != tswc then
      真
        置换 任务游标 为 等待任务中最后的一个任务 set tsw[tswv] = tsw[tswc]
    如果 等待任务总数为零 if tswc  < 1 then
      真  空的 等待任务列表
        设置 任务游标为负一 set tswv = -1
      假  需要重新出检索等待任务列表中最近的待开启任务
        设置 任务游标为负二 set tswv = -2
    清空 等待任务中最后的一个任务 set tsw[tswc] = 0
    
    
    如果 临时任务变量的任务状态是开启的 if ttp.isOn() then
      真
        设置 运行任务列表总数位置任务为 临时任务 set tsr[tsrc] = ttp
        如果 运行任务列表为空 if tsrv == -1 then
          真
            设置 运行任务游标为零 set tsrv = 0
          假 附加条件 运行任务游标指向任务 要在 临时任务 后面执行 elseif not zcTasks(tsr[tsrv])onTime(ttp.time + ttp.timeout) then
            真
              设置 运行任务游标 指向 临时任务 set tsrv = tsrc
        设置 运行任务总数增加一  set tsrc = tsrc + 1
      假
        设置 关闭任务列表总数位置任务为 临时任务 set tso[tsoc] = ttp
        如果 关闭任务列表为空 if tsrv == -1 then
          设置 关闭任务游标为零 set tsov = 0
        设置 关闭任务总数增加一  set tsoc = tsoc + 1
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  