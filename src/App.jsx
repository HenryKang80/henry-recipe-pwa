// Henry의 레시피 앱 기본 코드 구조 (React 기반)
// 메인 화면: 앱 대표 이미지, 저장된 레시피 리스트, 레시피 추가 버튼
// 레시피 추가는 별도 뷰로 전환

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const user = true; // 임시 로그인 상태 대체

export default function RecipeApp() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState([{ description: '', item: '', amount: '' }]);
  const [checkedSteps, setCheckedSteps] = useState([]);
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState(null);
  const [savedList, setSavedList] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [currentRecipeId, setCurrentRecipeId] = useState(null);
  const [viewRecipe, setViewRecipe] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImage(objectUrl);
    }
  };

  const handleStepChange = (index, field, value) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };

  const toggleChecked = (index) => {
    setCheckedSteps(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const addStep = () => {
    setSteps([...steps, { description: '', item: '', amount: '' }]);
  };

  const saveRecipe = () => {
    const recipe = {
      id: currentRecipeId || Date.now(),
      title,
      category,
      ingredients,
      steps,
      notes,
      image
    };
    const updatedList = savedList.some(r => r.id === recipe.id)
      ? savedList.map(r => (r.id === recipe.id ? recipe : r))
      : [recipe, ...savedList];
    setSavedList(updatedList);
    setViewRecipe(null);
    alert('레시피가 저장되었습니다!');
    setShowEditor(false);
    setCurrentRecipeId(null);
  };

  const deleteRecipe = (id) => {
    if (window.confirm("정말 이 레시피를 삭제할까요? 삭제 후에는 복구할 수 없습니다.")) {
      const updatedList = savedList.filter(r => r.id !== id);
      setSavedList(updatedList);
    }
  };

  const editRecipe = (recipe) => {
    setCurrentRecipeId(recipe.id);
    setTitle(recipe.title);
    setCategory(recipe.category);
    setIngredients(recipe.ingredients);
    setSteps(recipe.steps);
    setNotes(recipe.notes);
    setImage(recipe.image);
    setShowEditor(true);
  };

  const shareRecipe = (recipe) => {
    const text = `📋 ${recipe.title}\n\n카테고리: ${recipe.category}\n\n재료: ${recipe.ingredients}\n\n메모: ${recipe.notes}`;
    navigator.clipboard.writeText(text).then(() => alert("레시피 정보가 복사되었습니다. 원하는 곳에 붙여넣기 해주세요!"));
  };

  const filteredList = filterCategory
    ? savedList.filter(r => r.category.includes(filterCategory))
    : savedList;

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p className="mb-4">로그인이 필요합니다</p>
        <Button onClick={() => alert('로그인 기능은 준비 중입니다.')}>로그인</Button>
      </div>
    );
  }

  if (showEditor) {
    return (
      <div className="max-w-xl mx-auto p-4 space-y-10">
        <Card>
          <CardContent className="space-y-4">
            <Input placeholder="메뉴명" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input placeholder="카테고리 (ex. 탕, 구이, 회)" value={category} onChange={(e) => setCategory(e.target.value)} />
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            {image && <img src={image} alt="대표 이미지" className="rounded-xl shadow w-full" />}
            <Textarea placeholder="재료 전체를 정리해 입력하세요 (선택)" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">조리 순서</h3>
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col space-y-1 p-2 border rounded-md">
                  <div className="flex items-center space-x-2">
                    <Textarea
                      className="flex-1"
                      placeholder={`Step ${idx + 1} 설명`}
                      value={step.description}
                      onChange={(e) => handleStepChange(idx, 'description', e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      className="w-1/2"
                      placeholder="재료명"
                      value={step.item}
                      onChange={(e) => handleStepChange(idx, 'item', e.target.value)}
                    />
                    <Input
                      className="w-1/2"
                      placeholder="용량 (예: 20g, 100ml 등)"
                      value={step.amount}
                      onChange={(e) => handleStepChange(idx, 'amount', e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <Button onClick={addStep} variant="outline">+ 조리 단계 추가</Button>
            </div>

            <Textarea placeholder="추가 메모" value={notes} onChange={(e) => setNotes(e.target.value)} />
            <Button className="w-full mt-4" onClick={saveRecipe}>레시피 저장</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (viewRecipe) {
    return (
      <div className="max-w-xl mx-auto p-4 space-y-6">
        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-2xl font-bold">{viewRecipe.title}</h2>
            <p className="text-muted-foreground">{viewRecipe.category}</p>
            {viewRecipe.image && <img src={viewRecipe.image} alt="preview" className="w-full rounded-md" />}
            <p className="whitespace-pre-line">🧂 재료:
{viewRecipe.ingredients}</p>
            <ul className="space-y-2">
              {viewRecipe.steps.map((step, idx) => (
                <li key={idx} id={`step-${idx}`} className="border p-2 rounded-md flex items-start space-x-2">
                  <Checkbox className="mt-1" onCheckedChange={checked => {
                    const el = document.getElementById(`step-${idx}`);
                    if (el) el.classList.toggle('bg-gray-200', checked);
                  }} />
                  <div><strong>Step {idx + 1}:</strong> {step.description}<br/>
                  📌 {step.item} - {step.amount}</div>
                </li>
              ))}
            </ul>
            {viewRecipe.notes && <p>💬 메모: {viewRecipe.notes}</p>}
            <Button onClick={() => setViewRecipe(null)}>돌아가기</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-10">
      <div className="text-center">
        <img src="/logo.png" alt="앱 대표 이미지" className="w-32 mx-auto" />
        <Button className="mt-4" onClick={() => setShowEditor(true)}>+ 레시피 추가</Button>
      </div>

      <Input
        placeholder="카테고리 필터 (예: 회, 탕 등)"
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
      />

      {filteredList.length > 0 ? (
        filteredList.map((r) => (
          <Card key={r.id} className="p-4 space-y-2">
            <h3 className="text-lg font-bold cursor-pointer" onClick={() => setViewRecipe(r)}>{r.title}</h3>
            <p className="text-sm text-muted-foreground">{r.category}</p>
            {r.image && <img src={r.image} alt="preview" className="w-full max-h-52 object-cover rounded-md" />}
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => shareRecipe(r)}>공유</Button>
              <Button variant="outline" onClick={() => editRecipe(r)}>수정</Button>
              <Button variant="destructive" onClick={() => deleteRecipe(r.id)}>삭제</Button>
            </div>
          </Card>
        ))
      ) : (
        <p className="text-center text-muted">저장된 레시피가 없습니다.</p>
      )}
    </div>
  );
}
