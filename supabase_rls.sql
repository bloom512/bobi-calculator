-- 启用RLS
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户读取所有活动
CREATE POLICY "Allow anonymous read" ON activities
  FOR SELECT USING (true);

-- 允许匿名用户插入活动
CREATE POLICY "Allow anonymous insert" ON activities
  FOR INSERT WITH CHECK (true);

-- 允许匿名用户更新活动
CREATE POLICY "Allow anonymous update" ON activities
  FOR UPDATE USING (true);

-- 允许匿名用户删除活动
CREATE POLICY "Allow anonymous delete" ON activities
  FOR DELETE USING (true);
